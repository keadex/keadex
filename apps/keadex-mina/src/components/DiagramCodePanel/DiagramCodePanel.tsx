import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Diagram } from '@keadex/c4-model-ui-kit'
import { Button, IconButton } from '@keadex/keadex-ui-kit/cross'
import React, { useState } from 'react'
import DiagramHeader from '../DiagramHeader/DiagramHeader'

export interface DiagramCodePanelProps {
  setDiagramCodePanelVisible: React.Dispatch<React.SetStateAction<boolean>>
  hidden?: boolean
  diagram?: Diagram
}

enum CodeTab {
  PlantUML,
  JSON,
}

export const DiagramCodePanel = React.memo((props: DiagramCodePanelProps) => {
  const { setDiagramCodePanelVisible, diagram, hidden } = props

  const [activeTab, setActiveTab] = useState<CodeTab>(CodeTab.PlantUML)

  return (
    <div
      className={`${
        hidden
          ? 'hidden'
          : 'absolute z-[1] bg-dark-primary bg-opacity-90 w-full h-full p-2 overflow-auto'
      }`}
    >
      <IconButton
        icon={faXmark}
        className="absolute right-5 top-3"
        onClick={() => setDiagramCodePanelVisible(false)}
      />
      {diagram && (
        <div className="flex flex-col">
          <div>
            <Button
              className={`mr-3 w-32 normal-case ${
                activeTab === CodeTab.PlantUML ? '!bg-green-700' : ''
              }`}
              onClick={() => setActiveTab(CodeTab.PlantUML)}
            >
              PlantUML
            </Button>
            <Button
              className={`w-32 normal-case ${
                activeTab === CodeTab.JSON ? '!bg-green-700' : ''
              }`}
              onClick={() => setActiveTab(CodeTab.JSON)}
            >
              JSON
            </Button>
          </div>
          <div className="mt-5 p-2 bg-primary rounded-md overflow-auto">
            {activeTab === CodeTab.PlantUML
              ? diagram.raw_plantuml
              : JSON.stringify(diagram.diagram_spec)}
          </div>
        </div>
      )}
    </div>
  )
})

export default DiagramCodePanel
