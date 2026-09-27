import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faCircleInfo,
  faCode,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons'
import { C4DiagramCanvasCommands } from '@keadex/c4-model-ui-kit'
import { IconButton } from '@keadex/keadex-ui-kit/cross'
import type { Dispatch, SetStateAction } from 'react'
import { memo } from 'react'
import { twMerge } from 'tailwind-merge'

export interface DiagramDesignViewFloatMenuProps {
  c4DiagramRef?: C4DiagramCanvasCommands | null
  readOnly?: boolean
  diagramInfoPanelVisible: boolean
  setDiagramInfoPanelVisible: Dispatch<SetStateAction<boolean>>
  diagramCodePanelVisible: boolean
  setDiagramCodePanelVisible: Dispatch<SetStateAction<boolean>>
}

const styleButton = `text-5xl text-dark-primary hover:text-third`
const styleCenterButtons = `text-2xl text-dark-primary hover:text-third`

export const DiagramDesignViewFloatMenu = memo(
  (props: DiagramDesignViewFloatMenuProps) => {
    const {
      c4DiagramRef,
      readOnly,
      diagramInfoPanelVisible,
      setDiagramInfoPanelVisible,
      diagramCodePanelVisible,
      setDiagramCodePanelVisible,
    } = props

    function isReadOnly() {
      return readOnly
    }

    function handleToggleDiagramInfoPanelBtnClick() {
      if (isReadOnly()) {
        setDiagramCodePanelVisible(false)
        setDiagramInfoPanelVisible(!diagramInfoPanelVisible)
      }
    }

    function handleToggleDiagramCodePanelBtnClick() {
      if (isReadOnly()) {
        setDiagramInfoPanelVisible(false)
        setDiagramCodePanelVisible(!diagramCodePanelVisible)
      }
    }

    return (
      <div className="absolute bottom-0 left-0 z-1 scale-[85%] opacity-20 transition hover:scale-[100%] hover:opacity-100 flex flex-row mx-2">
        <IconButton
          className={twMerge(
            styleCenterButtons,
            isReadOnly() ? 'absolute' : 'hidden',
          )}
          icon={faCircleInfo}
          onClick={handleToggleDiagramInfoPanelBtnClick}
        />
        <IconButton
          className={twMerge(
            styleCenterButtons,
            isReadOnly() ? 'absolute bottom-1' : 'hidden',
          )}
          icon={faCode}
          onClick={handleToggleDiagramCodePanelBtnClick}
        />
        <div className="flex flex-col">
          <IconButton
            className={twMerge(styleButton, `my-auto!`)}
            icon={faCaretLeft}
            onClick={() => c4DiagramRef?.panLeft()}
          />
        </div>
        <div className="flex flex-col">
          <IconButton
            className={styleButton}
            icon={faCaretUp}
            onClick={() => c4DiagramRef?.panDown()}
          />
          <div>
            <IconButton
              className={twMerge(styleCenterButtons, `ml-1`)}
              icon={faMagnifyingGlassPlus}
              onClick={() => c4DiagramRef?.zoomIn()}
            />
            <IconButton
              className={twMerge(styleCenterButtons, `mx-2 text-xl!`)}
              icon={faRotateLeft}
              onClick={() => {
                c4DiagramRef?.resetZoom()
                c4DiagramRef?.resetPan()
              }}
            />
            <IconButton
              className={twMerge(styleCenterButtons, `mr-1`)}
              icon={faMagnifyingGlassMinus}
              onClick={() => c4DiagramRef?.zoomOut()}
            />
          </div>
          <IconButton
            className={styleButton}
            icon={faCaretDown}
            onClick={() => c4DiagramRef?.panUp()}
          />
        </div>
        <div className="flex flex-col">
          <IconButton
            className={twMerge(styleButton, `my-auto!`)}
            icon={faCaretRight}
            onClick={() => c4DiagramRef?.panRight()}
          />
        </div>
      </div>
    )
  },
)

export default DiagramDesignViewFloatMenu
