import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Diagram } from '@keadex/c4-model-ui-kit'
import { IconButton } from '@keadex/keadex-ui-kit/cross'
import { Dispatch, memo, SetStateAction } from 'react'

import DiagramHeader from '../DiagramHeader/DiagramHeader'

export interface DiagramInfoPanelProps {
  setDiagramInfoPanelVisible: Dispatch<SetStateAction<boolean>>
  hidden?: boolean
  diagram?: Diagram
}

export const DiagramInfoPanel = memo((props: DiagramInfoPanelProps) => {
  const { setDiagramInfoPanelVisible, diagram, hidden } = props

  return (
    <div
      className={`${
        hidden
          ? 'hidden'
          : 'absolute z-1 bg-dark-primary/90 w-full p-2 max-h-96 overflow-auto'
      }`}
    >
      <IconButton
        icon={faXmark}
        className="absolute right-5 top-3"
        onClick={() => setDiagramInfoPanelVisible(false)}
      />
      {diagram && (
        <DiagramHeader diagram={diagram} tagsDirection="bottom" scrollable />
      )}
    </div>
  )
})

export default DiagramInfoPanel
