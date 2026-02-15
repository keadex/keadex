import { faCopy, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Diagram } from '@keadex/c4-model-ui-kit'
import { Button, IconButton } from '@keadex/keadex-ui-kit/cross'
import type { Dispatch, SetStateAction } from 'react'
import { memo, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export interface DiagramCodePanelProps {
  setDiagramCodePanelVisible: Dispatch<SetStateAction<boolean>>
  hidden?: boolean
  diagram?: Diagram
}

enum CodeTab {
  PlantUML,
  JSON,
}

export const DiagramCodePanel = memo((props: DiagramCodePanelProps) => {
  const { setDiagramCodePanelVisible, diagram, hidden } = props

  const [activeTab, setActiveTab] = useState<CodeTab>(CodeTab.PlantUML)
  const [code, setCode] = useState(diagram?.raw_plantuml)

  useEffect(() => {
    if (diagram) {
      setCode(
        activeTab === CodeTab.PlantUML
          ? diagram.raw_plantuml
          : JSON.stringify(diagram.diagram_spec, null, 2),
      )
    }
  }, [diagram, activeTab])

  return (
    <div
      className={`${
        hidden
          ? 'hidden'
          : 'absolute z-1 bg-dark-primary/90 w-full h-full p-2 overflow-auto'
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
              className={twMerge(
                `mr-3 w-32 normal-case`,
                activeTab === CodeTab.PlantUML ? 'bg-green-700!' : '',
              )}
              onClick={() => setActiveTab(CodeTab.PlantUML)}
            >
              PlantUML
            </Button>
            <Button
              className={twMerge(
                `w-32 normal-case`,
                activeTab === CodeTab.JSON ? 'bg-green-700!' : '',
              )}
              onClick={() => setActiveTab(CodeTab.JSON)}
            >
              JSON
            </Button>
          </div>
          <div className="mt-5 p-2 bg-primary rounded-md overflow-auto whitespace-pre-wrap text-sm font-mono text-gray-300">
            <IconButton
              icon={faCopy}
              className="absolute right-5 text-xl"
              onClick={() => {
                if (code) navigator.clipboard.writeText(code)
              }}
            />
            <div>{code}</div>
          </div>
        </div>
      )}
    </div>
  )
})

export default DiagramCodePanel
