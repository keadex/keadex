import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons'
import { IconButton, KeadexCanvas } from '@keadex/keadex-ui-kit/cross'
import React from 'react'

export interface DiagramDesignViewFloatMenuProps {
  canvas?: KeadexCanvas
}

const styleButton = `text-5xl text-dark-primary hover:text-third`
const styleCenterButtons = `text-2xl text-dark-primary hover:text-third`

export const DiagramDesignViewFloatMenu = React.memo(
  (props: DiagramDesignViewFloatMenuProps) => {
    const { canvas } = props

    return (
      <div className="absolute bottom-0 left-0 z-[1] scale-[85%] opacity-20 transition hover:scale-[100%] hover:opacity-100 flex flex-row mx-2">
        <div className="flex flex-col">
          <IconButton
            className={`${styleButton} !my-auto`}
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
              className={`${styleCenterButtons} ml-1`}
              icon={faMagnifyingGlassPlus}
              onClick={() => canvas?.zoomIn()}
            />
            <IconButton
              className={`${styleCenterButtons} mx-2 !text-xl`}
              icon={faRotateLeft}
              onClick={() => {
                canvas?.resetZoom()
                canvas?.resetPan()
              }}
            />
            <IconButton
              className={`${styleCenterButtons} mr-1`}
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
            className={`${styleButton} !my-auto`}
            icon={faCaretRight}
            onClick={() => canvas?.panRight()}
          />
        </div>
      </div>
    )
  },
)

export default DiagramDesignViewFloatMenu
