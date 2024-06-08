import {
  faBook,
  faCopy,
  faCut,
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
import { DIAGRAM_ELEMENTS_TYPES } from '@keadex/c4-model-ui-kit'
import {
  DropdownMenu,
  DropdownMenuItemProps,
  IconButton,
  Separator,
  useForceUpdate,
} from '@keadex/keadex-ui-kit/cross'
import { kebabCase, snakeCase } from 'change-case'
import { Ref, forwardRef, useEffect, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'tw-elements'
import { DiagramCodeViewCommands } from '../../views/DiagramEditor/DiagramCodeView/DiagramCodeView'

export interface DiagramCodeViewToolbarProps {
  diagramCodeViewCommands: DiagramCodeViewCommands | null
}

export interface DiagramCodeViewToolbarCommands {
  forceUpdate: () => void
}

const styleButton =
  'container-link-bg hover:bg-secondary disabled:hover:bg-transparent w-10 h-10'

export const DiagramCodeViewToolbar = forwardRef(
  (
    props: DiagramCodeViewToolbarProps,
    ref: Ref<DiagramCodeViewToolbarCommands>,
  ) => {
    const { diagramCodeViewCommands } = props

    const AI_ENABLED = JSON.parse(import.meta.env.VITE_AI_ENABLED)
    const { t } = useTranslation()
    const { forceUpdate } = useForceUpdate()

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

    return (
      <div id="diagram-code-view-toolbar" className="w-full z-[6]">
        <div className="p-3">
          <div className="bg-primary flex w-full flex-1 rounded text-sm drop-shadow-md">
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
          </div>
        </div>
      </div>
    )
  },
)

export default DiagramCodeViewToolbar
