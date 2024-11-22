import {
  C4ElementType,
  C4ElementTypeExtended,
  DIAGRAM_ELEMENTS_TYPES,
  Diagram,
  DiagramElementType,
  DiagramPlantUML,
  componentDiagramElement,
  containerDiagramElement,
  linkableDiagramElement,
  softwareSystemDiagramElement,
} from '@keadex/c4-model-ui-kit'
import { useForceUpdate, useModal } from '@keadex/keadex-ui-kit/cross'
import Editor, { loader } from '@monaco-editor/react'
import { noCase, snakeCase } from 'change-case'
import * as monaco from 'monaco-editor'
import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import AISpeechBubble from '../../../components/AISpeechBubble/AISpeechBubble'
import DiagramLinker from '../../../components/DiagramLinker/DiagramLinker'
import ModalImportLibraryElement from '../../../components/ModalImportLibraryElement/ModalImportLibraryElement'
import {
  deserializePlantUMLByString,
  parsedElementToPlantUML,
} from '../../../core/tauri-rust-bridge'
import { MinaError } from '../../../models/autogenerated/MinaError'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IQuickInputService } from 'monaco-editor/esm/vs/platform/quickinput/common/quickInput'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { QuickInputService } from 'monaco-editor/esm/vs/platform/quickinput/browser/quickInputService'
import { v4 as uuidv4 } from 'uuid'
import { DiagramCodeViewToolbarCommands } from '../../../components/DiagramCodeViewToolbar/DiagramCodeViewToolbar'
import ModalCRUBoundary from '../../../components/ModalCRULibraryElement/ModalCRUBoundary/ModalCRUBoundary'
import ModalCRUComponent from '../../../components/ModalCRULibraryElement/ModalCRUComponent/ModalCRUComponent'
import ModalCRUContainer from '../../../components/ModalCRULibraryElement/ModalCRUContainer/ModalCRUContainer'
import ModalCRUDeploymentNode from '../../../components/ModalCRULibraryElement/ModalCRUDeploymentNode/ModalCRUDeploymentNode'
import ModalCRUPerson from '../../../components/ModalCRULibraryElement/ModalCRUPerson/ModalCRUPerson'
import ModalCRURelationship from '../../../components/ModalCRULibraryElement/ModalCRURelationship/ModalCRURelationship'
import ModalCRUSoftwareSystem from '../../../components/ModalCRULibraryElement/ModalCRUSoftwareSystem/ModalCRUSoftwareSystem'
import { libraryDiagramElement } from '../../../helper/library-helper'
import { Project } from '../../../models/autogenerated/Project'
import {
  PLANTUML_LANGUAGE,
  initC4PlantUMLLanguage,
} from './c4plantuml-monaco-language'

initC4PlantUMLLanguage()
loader.config({ monaco })

// https://github.com/opensumi/monaco-editor-core/blob/main/src/vs/platform/quickinput/common/quickInput.ts
// For some reasons monaco does not export this type...
export interface IQuickPickItem {
  type?: 'item'
  id?: string
  label: string
}

export interface DiagramCodeViewProps {
  project?: Project
  diagram?: Diagram
  error?: MinaError
  diagramCodeViewToolbarCommands: DiagramCodeViewToolbarCommands | null
  saveDiagram: () => void
  isSaving: boolean
}

export interface DiagramCodeViewCommands {
  resetCode: () => void
  getUpdatedRawPlantUML: () => string | undefined
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  copy: () => void
  cut: () => void
  paste: () => void
  find: () => void
  commands: () => void
  openAI: () => void
  addCodeAtCursorPosition: (code: string, cursorPosition?: number) => void
  addToLibrary: () => void
  importFromLibrary: () => void
  addDiagramElement: (
    c4ElementType: C4ElementType | C4ElementTypeExtended,
  ) => void
  addDiagramLink: () => void
  replaceLineContent: (lineNumber: number, newContent: string) => void
  selectText: (text: string) => void
}

export const DiagramCodeView = forwardRef(
  (props: DiagramCodeViewProps, ref: Ref<DiagramCodeViewCommands>) => {
    const { diagram, saveDiagram, isSaving, project } = props

    const { t } = useTranslation()
    const { modal, showModal, hideModal } = useModal()
    const { forceUpdate } = useForceUpdate()

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
    const [rawPlantuml, setRawPlantuml] = useState('')
    const [editorPosition, setEditorPosition] =
      useState<monaco.Position | null>(null)
    const [currentVersionID, setCurrentVersionID] = useState(-1)
    const [initialVersionID, setInitialVersionID] = useState(-1)
    const [lastVersionID, setLastVersionID] = useState(-1)
    const [aiHidden, setAiHidden] = useState(true)
    const canEditorUndo = useRef(false)
    const canEditorRedo = useRef(false)

    useEffect(() => {
      function handle(e: KeyboardEvent) {
        if (e.key.toUpperCase() === 'S' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault()
          saveDiagram()
        }
      }
      document.addEventListener('keydown', handle)
      return () => document.removeEventListener('keydown', handle)
    }, [diagram, editorPosition, saveDiagram])

    useEffect(() => {
      if (editorRef.current) {
        if (editorPosition) {
          editorRef.current.focus()
          editorRef.current.setPosition(editorPosition)
          editorRef.current.updateOptions({ readOnly: isSaving })
        } else {
          editorRef.current.setPosition({ lineNumber: 0, column: 0 })
        }
      }
    })

    useEffect(() => {
      if (diagram) {
        canEditorUndo.current = true
        const { raw_plantuml } = diagram
        setRawPlantuml(raw_plantuml ?? '')
      }
    }, [diagram])

    useImperativeHandle(ref, () => ({
      resetCode: () => {
        // Setting the editor value, clear the undo/redo stack
        editorRef.current?.getModel()?.setValue('')
        setRawPlantuml('')
        // In the handleEditorChange() the canEditorUndo is properly set according to the
        // editor versions ids. The following "reset" the current and initial version ids
        // according to the current editor version id since in the Monaco editor is not possible
        // to reset the version ids.
        setCurrentVersionID(
          (editorRef.current?.getModel()?.getAlternativeVersionId() ?? -1) + 1,
        )
        setInitialVersionID(
          editorRef.current?.getModel()?.getAlternativeVersionId() ?? -1,
        )
      },
      getUpdatedRawPlantUML: (): string | undefined => {
        if (
          diagram &&
          diagram.diagram_name &&
          diagram.diagram_type &&
          editorRef.current
        ) {
          return editorRef.current.getValue()
        }
      },
      canUndo: (): boolean => {
        return canEditorUndo.current
      },
      canRedo: (): boolean => {
        return canEditorRedo.current
      },
      undo: () => {
        editorRef.current?.focus()
        editorRef.current?.trigger('', 'undo', {})
      },
      redo: () => {
        editorRef.current?.focus()
        editorRef.current?.trigger('', 'redo', {})
      },
      copy: () => {
        editorRef.current?.focus()
        editorRef.current?.trigger('', 'editor.action.clipboardCopyAction', {})
      },
      cut: () => {
        editorRef.current?.focus()
        editorRef.current?.trigger('', 'editor.action.clipboardCutAction', {})
      },
      paste: () => {
        editorRef.current?.focus()
        editorRef.current?.trigger('', 'editor.action.clipboardPasteAction', {})
      },
      find: () => {
        editorRef.current?.focus()
        editorRef.current?.trigger('', 'actions.find', {})
      },
      commands: () => {
        editorRef.current?.focus()
        editorRef.current?.trigger('', 'editor.action.quickCommand', {})
      },
      openAI: () => {
        setAiHidden(false)
      },
      addCodeAtCursorPosition: addCodeAtCursorPosition,
      addToLibrary: addToLibrary,
      importFromLibrary: importFromLibrary,
      addDiagramElement: addDiagramElement,
      addDiagramLink: addDiagramLink,
      replaceLineContent: replaceLineContent,
      selectText: selectText,
    }))

    function handleEditorDidMount(editor: monaco.editor.IStandaloneCodeEditor) {
      editor.getModel()?.setEOL(monaco.editor.EndOfLineSequence.LF)
      editorRef.current = editor
      const versionID =
        editorRef.current.getModel()?.getAlternativeVersionId() ?? -1
      setCurrentVersionID(versionID)
      setInitialVersionID(versionID)
      setLastVersionID(versionID)
      setContextMenu(editorRef.current)
    }

    function setContextMenu(editor: monaco.editor.IStandaloneCodeEditor) {
      editor.addAction({
        id: 'add-to-library',
        label: t('diagram_editor.add_to_library'),
        contextMenuGroupId: '1_modification',
        contextMenuOrder: 1,
        run: function (ed) {
          addToLibrary()
        },
      })
      editor.addAction({
        id: 'import-from-library',
        label: t('diagram_editor.import_from_library'),
        contextMenuGroupId: '1_modification',
        contextMenuOrder: 1,
        run: function (ed) {
          importFromLibrary()
        },
      })
      editor.addAction({
        id: 'add-diagram-link',
        label: t('diagram_editor.link_to'),
        contextMenuGroupId: '1_modification',
        contextMenuOrder: 1,
        run: function (ed) {
          addDiagramLink()
        },
      })

      const quickInputCommand = editor.addCommand(
        0,
        (accessor, func, a, b, c) => {
          // a hacker way to get the input service
          func(accessor.get(IQuickInputService))
        },
      )

      if (quickInputCommand) {
        editor.addAction({
          id: 'add-diagram-element',
          label: t('diagram_editor.add_diagram_element'),
          contextMenuGroupId: '1_modification',
          contextMenuOrder: 1,

          run: function () {
            editor.trigger(
              '',
              quickInputCommand,
              (quickInput: QuickInputService) => {
                quickInput
                  .pick(
                    DIAGRAM_ELEMENTS_TYPES.map((diagramElementType) => {
                      return {
                        type: 'item',
                        id: diagramElementType,
                        label: t(`common.${snakeCase(diagramElementType)}`),
                      }
                    }),
                  )
                  .then((selected?: IQuickPickItem) => {
                    if (selected?.id)
                      addDiagramElement(
                        selected.id as C4ElementType | C4ElementTypeExtended,
                      )
                  })
              },
            )
          },
        })
      }
    }

    function handleEditorChange(
      value: string | undefined,
      ev: monaco.editor.IModelContentChangedEvent,
    ) {
      if (editorRef.current?.getModel())
        setRawPlantuml(editorRef.current?.getModel()!.getValue())

      setEditorPosition(editorRef.current?.getPosition() ?? null)

      const versionId =
        editorRef.current?.getModel()?.getAlternativeVersionId() ?? -1

      // undoing
      if (versionId <= currentVersionID) {
        canEditorRedo.current = true
        // no more undo possible
        if (versionId === initialVersionID) {
          canEditorUndo.current = false
        }
      } else {
        // redoing
        if (versionId <= lastVersionID) {
          // redoing the last change
          if (versionId === lastVersionID) {
            canEditorRedo.current = false
          }
        } else {
          // adding new change, disable redo when adding new changes
          canEditorRedo.current = false
          if (currentVersionID > lastVersionID) {
            setLastVersionID(currentVersionID)
          }
        }
        canEditorUndo.current = true
      }
      setCurrentVersionID(versionId)

      props.diagramCodeViewToolbarCommands?.forceUpdate()
    }

    function addCodeAtCursorPosition(code: string, cursorPosition?: number) {
      editorRef.current?.focus()
      editorRef.current?.trigger('keyboard', 'type', { text: code })
    }

    function replaceLineContent(lineNumber: number, newContent: string) {
      const editor = editorRef.current
      const model = editor?.getModel()

      if (editor && model) {
        // Get the current selection of the editor
        const currentSelection = editor.getSelection()

        // Get the current content of the editor
        const currentContent = editor.getValue()

        // Split the content into lines
        const lines = currentContent?.split('\n')

        if (lines) {
          // Replace the content of the specified line number
          if (lineNumber >= 1 && lineNumber <= lines.length) {
            lines[lineNumber - 1] = newContent
          }

          // Join the modified lines back into a single string
          const updatedLines = lines.join('\n')

          // Set the new content for the editor
          const editOperation = {
            range: model.getFullModelRange(),
            text: updatedLines,
            forceMoveMarkers: false,
          }
          editor.executeEdits(
            'replaceLineContent',
            [editOperation],
            currentSelection !== null ? [currentSelection] : [],
          )
          editor.pushUndoStop()
        }
      }
    }

    async function addToLibrary() {
      const result = await getSelectedDiagramElement()
      const elementToAdd =
        result?.diagramPlantUML !== undefined &&
        result.diagramPlantUML.elements !== undefined &&
        result.diagramPlantUML.elements.length === 1 &&
        libraryDiagramElement(result.diagramPlantUML.elements[0])

      if (
        result &&
        elementToAdd !== undefined &&
        typeof elementToAdd !== 'boolean'
      ) {
        elementToAdd.element.base_data.uuid = uuidv4()
        let Modal
        switch (elementToAdd.elementType) {
          case 'Person':
            Modal = ModalCRUPerson
            break
          case 'SoftwareSystem':
            Modal = ModalCRUSoftwareSystem
            break
          case 'Container':
            Modal = ModalCRUContainer
            break
          case 'Component':
            Modal = ModalCRUComponent
            break
        }
        if (Modal !== undefined) {
          showModal({
            id: `${elementToAdd.elementType.toLowerCase()}Modal`,
            title: `${t('diagram_editor.add_to_library_detailed_title', {
              elementType: noCase(elementToAdd.elementType).toLowerCase(),
              alias: elementToAdd.element.base_data.alias,
            })}`,
            body: (
              <Modal
                enableEdit={true}
                project={project}
                libraryElement={elementToAdd.element}
                hideModal={hideModal}
                mode="createLibraryElement"
              />
            ),
            buttons: false,
          })
          return
        }
      }

      toast.error(t('common.error.cannot_add_to_library'))
    }

    function importFromLibrary() {
      setEditorPosition(editorRef.current?.getPosition() ?? null)
      showModal({
        id: 'importLibraryElementModal',
        title: t('diagram_editor.import_from_library').toString(),
        body: (
          <ModalImportLibraryElement
            onLibraryElementSelected={(libraryElement: DiagramElementType) => {
              parsedElementToPlantUML(libraryElement)
                .then((plantUML) => {
                  addCodeAtCursorPosition(plantUML)
                  toast.success(t('diagram_editor.element_imported'))
                })
                .catch((error: MinaError) => {
                  toast.error(
                    t('common.error.internal', {
                      errorMessage: error.msg ?? error,
                    }),
                  )
                })
            }}
            hideModal={hideModal}
          />
        ),
        buttons: false,
        size: 'full',
      })
    }

    async function addDiagramElement(
      c4ElementType: C4ElementType | C4ElementTypeExtended,
    ) {
      setEditorPosition(editorRef.current?.getPosition() ?? null)
      let Modal = ModalCRUPerson
      switch (c4ElementType) {
        case 'Person':
          Modal = ModalCRUPerson
          break
        case 'Container':
          Modal = ModalCRUContainer
          break
        case 'Component':
          Modal = ModalCRUComponent
          break
        case 'SoftwareSystem':
          Modal = ModalCRUSoftwareSystem
          break
        case 'Boundary':
          Modal = ModalCRUBoundary
          break
        case 'DeploymentNode':
          Modal = ModalCRUDeploymentNode
          break
        case 'Relationship':
          Modal = ModalCRURelationship
          break
      }
      const onElementCreated = (element: DiagramElementType) => {
        parsedElementToPlantUML(element)
          .then((plantUML) => {
            addCodeAtCursorPosition(plantUML)
          })
          .catch((error: MinaError) => {
            toast.error(
              t('common.error.internal', {
                errorMessage: error.msg ?? error,
              }),
            )
          })
      }

      showModal({
        id: `${c4ElementType.toLowerCase()}Modal`,
        title: `${t('common.new')} ${t(`common.${snakeCase(c4ElementType)}`)}`,
        body: (
          <Modal
            mode="serializer"
            enableEdit={true}
            hideModal={hideModal}
            forceUpdate={forceUpdate}
            onElementCreated={onElementCreated}
          />
        ),
        buttons: false,
      })
    }

    async function getSelectedDiagramElement() {
      let result:
        | {
            selectedPlantUMLLine: string
            diagramPlantUML: DiagramPlantUML
            cursorPosition: monaco.Position
          }
        | undefined
      const cursorPosition = editorRef.current?.getPosition()
      setEditorPosition(cursorPosition ?? null)
      const selection = editorRef.current?.getSelection()
      if (selection && cursorPosition) {
        if (
          selection.startLineNumber === selection.endLineNumber &&
          selection.startLineNumber === cursorPosition.lineNumber
        ) {
          const selectedPlantUMLLine = editorRef.current
            ?.getModel()
            ?.getLineContent(cursorPosition.lineNumber)
          if (selectedPlantUMLLine) {
            try {
              result = {
                selectedPlantUMLLine,
                diagramPlantUML: await deserializePlantUMLByString(
                  `@startuml\n${selectedPlantUMLLine}\n@enduml`,
                ),
                cursorPosition,
              }
            } catch (e) {
              result = undefined
            }
          }
        }
      }
      return result
    }

    async function addDiagramLink() {
      const result = await getSelectedDiagramElement()
      const elementToLink =
        result?.diagramPlantUML !== undefined &&
        result.diagramPlantUML.elements !== undefined &&
        result.diagramPlantUML.elements.length === 1 &&
        linkableDiagramElement(result.diagramPlantUML.elements[0])

      if (
        result &&
        elementToLink !== undefined &&
        typeof elementToLink !== 'boolean'
      ) {
        showModal({
          id: 'linkDiagramModal',
          title: t('common.action.link_to_diagram', {
            alias: elementToLink.base_data.alias,
          }).toString(),
          body: (
            <DiagramLinker
              link={elementToLink.base_data.link}
              onLinkConfirmed={async (link) => {
                elementToLink.base_data.link = link
                let updatedPlantUML = result.selectedPlantUMLLine
                if (
                  softwareSystemDiagramElement(
                    result.diagramPlantUML.elements[0],
                  )
                ) {
                  updatedPlantUML = await parsedElementToPlantUML({
                    SoftwareSystem: elementToLink,
                  })
                } else if (
                  containerDiagramElement(result.diagramPlantUML.elements[0])
                ) {
                  updatedPlantUML = await parsedElementToPlantUML({
                    Container: elementToLink,
                  })
                } else if (
                  componentDiagramElement(result.diagramPlantUML.elements[0])
                ) {
                  updatedPlantUML = await parsedElementToPlantUML({
                    Component: elementToLink,
                  })
                }
                replaceLineContent(
                  result.cursorPosition.lineNumber,
                  updatedPlantUML.replace(new RegExp('\\n', 'gi'), ''),
                )
                hideModal()
              }}
            />
          ),
          buttons: false,
          size: 'md',
        })
        return
      }

      toast.error(t('common.error.cannot_add_link'))
    }

    function selectText(text?: string) {
      const editorModel = editorRef.current?.getModel()
      if (text) {
        const matches = editorModel?.findMatches(
          text,
          false,
          false,
          false,
          null,
          false,
        )
        if (matches) {
          matches.forEach((match): void => {
            editorRef.current?.setSelection(match.range)
            editorRef.current?.revealLine(match.range.startLineNumber)
          })
        }
      }
    }

    return (
      <div className="relative h-full w-full">
        {modal}
        <Editor
          className={`h-full ${!diagram ? 'hidden' : ''} no-underline`}
          language={PLANTUML_LANGUAGE}
          value={rawPlantuml}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          options={{ wordWrap: 'on', tabSize: 2 }}
        />
        <AISpeechBubble
          aiHidden={aiHidden}
          addCodeAtCursorPosition={addCodeAtCursorPosition}
          diagram={diagram}
          closeAI={() => setAiHidden(true)}
        />
      </div>
    )
  },
)

export default DiagramCodeView
