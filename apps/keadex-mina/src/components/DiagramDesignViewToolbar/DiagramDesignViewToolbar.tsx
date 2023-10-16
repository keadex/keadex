import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from '@fortawesome/free-solid-svg-icons'
import { IconButton, KeadexCanvas } from '@keadex/keadex-ui-kit/cross'
import React from 'react'

export interface DiagramDesignViewToolbarProps {
  canvas?: KeadexCanvas
}

const styleButton = `text-5xl -mt-2 text-dark-primary hover:text-third`
const styleZoomButton = `text-2xl text-dark-primary hover:text-third`

export const DiagramDesignViewToolbar = React.memo(
  (props: DiagramDesignViewToolbarProps) => {
    const { canvas } = props

    return (
      <div className="absolute bottom-0 left-0 z-[1] grid scale-[85%] grid-cols-3 opacity-20 transition hover:scale-[100%] hover:opacity-100">
        <div></div>
        <IconButton
          className={styleButton}
          icon={faCaretUp}
          onClick={() => canvas?.panDown()}
        />
        <div></div>
        <IconButton
          className={styleButton}
          icon={faCaretLeft}
          onClick={() => canvas?.panLeft()}
        />
        <div>
          <IconButton
            className={styleZoomButton}
            icon={faMagnifyingGlassPlus}
            onClick={() => canvas?.zoomIn()}
          />
          <IconButton
            className={`${styleZoomButton} ml-2`}
            icon={faMagnifyingGlassMinus}
            onClick={() => canvas?.zoomOut()}
          />
        </div>
        <IconButton
          className={styleButton}
          icon={faCaretRight}
          onClick={() => canvas?.panRight()}
        />
        <div></div>
        <IconButton
          className={styleButton}
          icon={faCaretDown}
          onClick={() => canvas?.panUp()}
        />
        <div></div>
      </div>
    )
  }
)

export default DiagramDesignViewToolbar
