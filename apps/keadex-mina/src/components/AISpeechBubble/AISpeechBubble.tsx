import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Diagram } from '@keadex/c4-model-ui-kit'
import { Button, IconButton, Textarea } from '@keadex/keadex-ui-kit/cross'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { generatePlantUMLWithAI } from '../../core/tauri-rust-bridge'
import { MinaError } from '../../models/autogenerated/MinaError'
import { useAppSelector } from '../../core/store/hooks'

export interface AISpeechBubbleProps {
  diagram?: Diagram
  addCodeAtCursorPosition: (code: string, cursorPosition?: number) => void
  aiHidden: boolean
  closeAI: () => void
}

export const AISpeechBubble = React.memo((props: AISpeechBubbleProps) => {
  const { aiHidden, diagram, addCodeAtCursorPosition, closeAI } = props
  const [AIQuestion, setAIQuestion] = useState('')
  const [generatingPlantUML, setGeneratingPlantUML] = useState(false)
  const { t } = useTranslation()
  const project = useAppSelector((state) => state.project.value)

  async function generatePlantUML() {
    if (
      !project?.project_settings.openai_api_key ||
      project.project_settings.openai_api_key.length === 0
    ) {
      toast.error(t('common.error.missing_openai_api_key'))
    } else if (diagram !== undefined) {
      setGeneratingPlantUML(true)
      await generatePlantUMLWithAI(AIQuestion)
        .then((generatedPlantUML) => {
          toast.success(`${t('diagram_editor.plantuml_generated')}!`)
          diagram.raw_plantuml = generatedPlantUML
          addCodeAtCursorPosition(generatedPlantUML)
          setGeneratingPlantUML(false)
        })
        .catch((error: MinaError) => {
          toast.error(error.msg)
          setGeneratingPlantUML(false)
        })
    }
  }

  return (
    <div
      className={`${
        aiHidden ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
      } absolute bottom-0 left-0 right-0 text-center transition delay-150 duration-300 ease-in-out`}
    >
      <IconButton
        className="absolute right-0 z-[1] -mt-3 mr-6 text-xl"
        icon={faXmark}
        onClick={closeAI}
      />
      <div className="content-center px-7">
        <Textarea
          className="resize-none"
          onChange={(e) => setAIQuestion(e.target.value)}
          value={AIQuestion}
          label={t('diagram_editor.ai_hint')}
          disabled={diagram === undefined}
        />
      </div>
      <Button
        className="relative -top-6"
        onClick={() => generatePlantUML()}
        disabled={generatingPlantUML}
      >
        {generatingPlantUML
          ? `${t('common.generating')}...`
          : t('common.generate')}
      </Button>
    </div>
  )
})

export default AISpeechBubble