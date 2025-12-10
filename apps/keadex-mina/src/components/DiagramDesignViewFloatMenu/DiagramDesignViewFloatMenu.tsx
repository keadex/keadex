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
import { IconButton, KeadexCanvas } from '@keadex/keadex-ui-kit/cross'
import type { Dispatch, SetStateAction } from 'react'
import { memo } from 'react'
import { twMerge } from 'tailwind-merge'

export interface DiagramDesignViewFloatMenuProps {
  canvas?: KeadexCanvas
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
      canvas,
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
            onClick={() => canvas?.panLeft()}
          />
        </div>
        <div className="flex flex-col">
          <IconButton
            className={styleButton}
            icon={faCaretUp}
            onClick={() => canvas?.panDown()}
          />
          <div>
            <IconButton
              className={twMerge(styleCenterButtons, `ml-1`)}
              icon={faMagnifyingGlassPlus}
              onClick={() => canvas?.zoomIn()}
            />
            <IconButton
              className={twMerge(styleCenterButtons, `mx-2 text-xl!`)}
              icon={faRotateLeft}
              onClick={() => {
                canvas?.resetZoom()
                canvas?.resetPan()
              }}
            />
            <IconButton
              className={twMerge(styleCenterButtons, `mr-1`)}
              icon={faMagnifyingGlassMinus}
              onClick={() => canvas?.zoomOut()}
            />
          </div>
          <IconButton
            className={styleButton}
            icon={faCaretDown}
            onClick={() => canvas?.panUp()}
          />
        </div>
        <div className="flex flex-col">
          <IconButton
            className={twMerge(styleButton, `my-auto!`)}
            icon={faCaretRight}
            onClick={() => canvas?.panRight()}
          />
        </div>
      </div>
    )
  },
)

export default DiagramDesignViewFloatMenu
