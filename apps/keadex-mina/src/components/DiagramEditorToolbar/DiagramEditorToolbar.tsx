import {
  faArrowRightFromBracket,
  faBook,
  faCopy,
  faCut,
  faFileExport,
  faFloppyDisk,
  faLink,
  faPaste,
  faPlus,
  faRobot,
  faRotateLeft,
  faRotateRight,
  faSearch,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  DIAGRAM_ELEMENTS_TYPES,
  Diagram,
  diagramTypeHumanName,
} from '@keadex/c4-model-ui-kit'
import {
  DropdownMenu,
  DropdownMenuItemProps,
  IconButton,
  Separator,
  Tags,
  useForceUpdate,
  useModal,
} from '@keadex/keadex-ui-kit/cross'
import { kebabCase, snakeCase } from 'change-case'
import { Ref, forwardRef, useEffect, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'tw-elements'
import { DiagramCodeViewCommands } from '../../views/DiagramEditor/DiagramCodeView/DiagramCodeView'
import { DiagramDesignViewCommands } from '../../views/DiagramEditor/DiagramDesignView/DiagramDesignView'
import ModalCRUDiagram from '../ModalCRUDiagram/ModalCRUDiagram'

export interface DiagramEditorToolbarProps {
  diagram?: Diagram
  diagramCodeViewCommands: DiagramCodeViewCommands | null
  diagramDesignViewCommands: DiagramDesignViewCommands | null
  saveDiagram: () => void
  closeDiagram: () => void
}

export interface DiagramEditorToolbarCommands {
  forceUpdate: () => void
}

const styleButton =
  'container-link-bg hover:bg-secondary disabled:hover:bg-transparent w-10 h-10'

export const DiagramEditorToolbar = forwardRef(
  (
    props: DiagramEditorToolbarProps,
    ref: Ref<DiagramEditorToolbarCommands>,
  ) => {
    const { diagramCodeViewCommands, diagramDesignViewCommands, diagram } =
      props

    const AI_ENABLED = JSON.parse(import.meta.env.VITE_AI_ENABLED)
    const { t } = useTranslation()
    const { forceUpdate } = useForceUpdate()
    const { modal, showModal, hideModal } = useModal()

    useEffect(() => {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-te-toggle="tooltip"]'),
      )
      tooltipTriggerList.map(
        (tooltipTriggerEl) =>
          new Tooltip(tooltipTriggerEl, { trigger: 'hover' }),
      )
    }, [])

    useEffect(() => {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-te-toggle="tooltip"]'),
      )

      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        const instance = Tooltip.getInstance(tooltipTriggerEl)
        instance?.enable()
        instance?.hide()
      })
    })

    useImperativeHandle(ref, () => ({
      forceUpdate,
    }))

    function generateAddDiagramElementMenu() {
      const addDiagramElementMenuItems: DropdownMenuItemProps[] = [
        {
          id: 'dropdown-add-diagram-element',
          label: (
            <div
              className={`${styleButton} text-accent-secondary hover:text-accent-primary [&.active]:text-accent-primary disabled:hover:text-accent-secondary disabled:opacity-50 text-base`}
            >
              <FontAwesomeIcon
                icon={faPlus}
                data-te-toggle="tooltip"
                data-te-placement="bottom"
                title={t('diagram_editor.add_diagram_element').toString()}
              />
            </div>
          ),
          isHeaderMenuItem: true,
          buttonClassName: '!p-0 !bg-transparent',
          subMenuItems: [],
        },
      ]

      DIAGRAM_ELEMENTS_TYPES.forEach((diagramElementType) => {
        addDiagramElementMenuItems[0].subMenuItems?.push({
          id: `add-diagram-element-${kebabCase(diagramElementType)}`,
          label: t(`common.${snakeCase(diagramElementType)}`),
          onClick: () =>
            diagramCodeViewCommands?.addDiagramElement(diagramElementType),
        })
      })

      return addDiagramElementMenuItems
    }

    function handleProjectInfoClick() {
      if (diagram && diagram.diagram_type && diagram.diagram_name) {
        showModal({
          id: `showInfoDiargamModal`,
          title: `${diagramTypeHumanName(diagram.diagram_type)} ${t(
            'common.diagram',
          )} - ${diagram.diagram_name}`,
          body: (
            <ModalCRUDiagram
              diagramName={diagram.diagram_name}
              diagramType={diagram.diagram_type}
              mode="readonly"
              hideModal={hideModal}
              forceUpdate={forceUpdate}
            />
          ),
          buttons: false,
        })
      }
    }

    return (
      <div id="diagram-editor-toolbar" className="w-full z-[6]">
        {modal}
        {diagram && diagram.diagram_type && (
          <div
            className="w-full pt-3 px-3 flex flex-col cursor-pointer"
            onClick={handleProjectInfoClick}
          >
            <div className="flex">
              <div className="text-lg grow truncate">
                {diagramTypeHumanName(diagram.diagram_type)}{' '}
                {t('common.diagram')} - {diagram.diagram_name}
              </div>
              {diagram.diagram_spec?.tags && (
                <div>
                  <Tags
                    tags={diagram.diagram_spec.tags}
                    className="float-right top-1/2 -translate-y-1/2"
                  />
                </div>
              )}
            </div>
            <div className="text-sm line-clamp-3">
              {diagram.diagram_spec?.description}
            </div>
          </div>
        )}

        <div className="p-3">
          <div className="bg-primary flex w-full flex-1 rounded text-sm drop-shadow-md">
            <IconButton
              icon={faFloppyDisk}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={`${t('common.save').toString()} ${t('common.diagram')
                .toString()
                .toLowerCase()}`}
              onClick={() => {
                props.saveDiagram()
              }}
            />
            <IconButton
              icon={faArrowRightFromBracket}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={`${t('common.close').toString()} ${t('common.diagram')
                .toString()
                .toLowerCase()}`}
              onClick={() => {
                props.closeDiagram()
              }}
            />
            <Separator />
            <IconButton
              disabled={diagramCodeViewCommands?.canUndo() === false}
              icon={faRotateLeft}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('common.undo').toString()}
              onClick={() => {
                diagramCodeViewCommands?.undo()
                forceUpdate()
              }}
            />
            <IconButton
              disabled={diagramCodeViewCommands?.canRedo() === false}
              icon={faRotateRight}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('common.redo').toString()}
              onClick={() => {
                diagramCodeViewCommands?.redo()
                forceUpdate()
              }}
            />
            <Separator />
            <IconButton
              icon={faCopy}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('common.copy').toString()}
              onClick={() => {
                diagramCodeViewCommands?.copy()
              }}
            />
            <IconButton
              icon={faCut}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('common.cut').toString()}
              onClick={() => {
                diagramCodeViewCommands?.cut()
              }}
            />
            <IconButton
              icon={faPaste}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('common.paste').toString()}
              onClick={() => {
                diagramCodeViewCommands?.paste()
              }}
            />
            <Separator />
            <IconButton
              icon={faSearch}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('common.find').toString()}
              onClick={() => {
                diagramCodeViewCommands?.find()
              }}
            />
            <IconButton
              icon={faTerminal}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('common.commands').toString()}
              onClick={() => {
                diagramCodeViewCommands?.commands()
              }}
            />
            <Separator />
            <DropdownMenu menuItemsProps={generateAddDiagramElementMenu()} />
            <IconButton
              icon={faBook}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('diagram_editor.import_from_library').toString()}
              onClick={() => {
                diagramCodeViewCommands?.importFromLibrary()
              }}
            />
            <IconButton
              icon={faLink}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('diagram_editor.add_diagram_link').toString()}
              onClick={() => {
                diagramCodeViewCommands?.addDiagramLink()
              }}
            />
            {AI_ENABLED && (
              <IconButton
                icon={faRobot}
                className={`${styleButton}`}
                data-te-toggle="tooltip"
                data-te-placement="bottom"
                title={t('diagram_editor.ai_diagram_generator').toString()}
                onClick={() => {
                  diagramCodeViewCommands?.openAI()
                }}
              />
            )}
            <Separator />
            <IconButton
              icon={faFileExport}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={`${t('common.export').toString()} ${t('common.diagram')
                .toString()
                .toLowerCase()}`}
              onClick={() => {
                diagramDesignViewCommands?.exportDiagram()
              }}
            />
          </div>
        </div>
      </div>
    )
  },
)

export default DiagramEditorToolbar
