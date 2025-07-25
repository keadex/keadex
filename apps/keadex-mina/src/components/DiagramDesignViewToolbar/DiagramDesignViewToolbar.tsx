import {
  faFileExport,
  faGear,
  faRotateLeft,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons'
import {
  IconButton,
  Separator,
  useForceUpdate,
} from '@keadex/keadex-ui-kit/cross'
import {
  Ref,
  RefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'tw-elements'
import { DiagramDesignViewCommands } from '../../views/DiagramEditor/DiagramDesignView/DiagramDesignView'

export interface DiagramDesignViewToolbarProps {
  diagramDesignViewCommands: RefObject<DiagramDesignViewCommands> | null
}

export interface DiagramDesignViewToolbarCommands {
  forceUpdate: () => void
}

const styleButton =
  'container-link-bg hover:bg-secondary disabled:hover:bg-transparent w-10 h-10'

export const DiagramDesignViewToolbar = forwardRef(
  (
    props: DiagramDesignViewToolbarProps,
    ref: Ref<DiagramDesignViewToolbarCommands>,
  ) => {
    const { diagramDesignViewCommands } = props

    const { t } = useTranslation()
    const { forceUpdate } = useForceUpdate()

    useImperativeHandle(ref, () => ({
      forceUpdate,
    }))

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

    return (
      <div id="diagram-design-view-toolbar" className="w-full z-[6]">
        <div className="p-3">
          <div className="bg-primary flex w-full flex-1 rounded text-sm drop-shadow-md">
            <IconButton
              disabled={diagramDesignViewCommands?.current?.canUndo() === false}
              icon={faRotateLeft}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('common.undo').toString()}
              onClick={() => {
                diagramDesignViewCommands?.current?.undo()
                forceUpdate()
              }}
            />
            <IconButton
              disabled={diagramDesignViewCommands?.current?.canRedo() === false}
              icon={faRotateRight}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('common.redo').toString()}
              onClick={() => {
                diagramDesignViewCommands?.current?.redo()
                forceUpdate()
              }}
            />
            <Separator />
            <IconButton
              icon={faGear}
              className={`${styleButton}`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={t('common.settings').toString()}
              onClick={() => {
                diagramDesignViewCommands?.current?.updateDiagramDesignViewSettings(
                  diagramDesignViewCommands?.current?.diagramDesignViewSettings(),
                )
                forceUpdate()
              }}
            />
            <div
              className={`${styleButton} w-fit px-3 cursor-pointer flex truncate`}
              data-te-toggle="tooltip"
              data-te-placement="bottom"
              title={`${t('diagram_editor.configure_auto_layout').toString()}`}
              onClick={() => {
                diagramDesignViewCommands?.current?.updateAutoLayoutOptions(
                  diagramDesignViewCommands?.current?.isAutoLayoutEnabled(),
                  diagramDesignViewCommands?.current?.autoLayoutOrientation(),
                  diagramDesignViewCommands?.current?.isGenerateOnlyStraightArrowsEnabled(),
                )
                forceUpdate()
              }}
            >
              <div
                className={`my-auto w-3 h-3 mr-2 rounded-full ${
                  diagramDesignViewCommands?.current?.isAutoLayoutEnabled()
                    ? 'bg-green-700'
                    : 'bg-red-700'
                }`}
              />
              <span className="my-auto truncate">
                {t('common.auto_layout')}
              </span>
            </div>
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
                diagramDesignViewCommands?.current?.exportDiagram()
              }}
            />
          </div>
        </div>
      </div>
    )
  },
)

export default DiagramDesignViewToolbar
