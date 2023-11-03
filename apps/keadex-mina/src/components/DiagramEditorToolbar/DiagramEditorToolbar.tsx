import {
  faArrowRightFromBracket,
  faBook,
  faCopy,
  faCut,
  faFileExport,
  faFloppyDisk,
  faLink,
  faPaste,
  faRobot,
  faRotateLeft,
  faRotateRight,
  faSearch,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons'
import {
  IconButton,
  Separator,
  useForceUpdate,
  useModal,
} from '@keadex/keadex-ui-kit/cross'
import { Ref, forwardRef, useEffect, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'tw-elements'
import { DiagramCodeViewCommands } from '../../views/DiagramEditor/DiagramCodeView/DiagramCodeView'
import { DiagramDesignViewCommands } from '../../views/DiagramEditor/DiagramDesignView/DiagramDesignView'

export interface DiagramEditorToolbarProps {
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
    const { diagramCodeViewCommands, diagramDesignViewCommands } = props

    const AI_ENABLED = JSON.parse(import.meta.env.VITE_AI_ENABLED)
    const { t } = useTranslation()
    const { forceUpdate } = useForceUpdate()
    const { modal } = useModal()

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

    return (
      <div id="diagram-editor-toolbar" className="w-full p-3">
        {modal}

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
    )
  },
)

export default DiagramEditorToolbar
