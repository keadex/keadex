import { Input } from '@keadex/keadex-ui-kit/cross'
import React, { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { ProjectSettings } from '../../models/autogenerated/ProjectSettings'
import { AISettings } from '../../models/autogenerated/AISettings'
import { AI_API_KEY, AI_BASE_URL, AI_MODEL } from '../../constants/ai'

export type AITabProps = {
  setNewProjectSettings: Dispatch<SetStateAction<ProjectSettings | undefined>>
  aiSettings?: AISettings
}

export const AITab = React.memo((props: AITabProps) => {
  const { t } = useTranslation()
  const { setNewProjectSettings, aiSettings } = props

  return (
    <div>
      <Input
        type="text"
        label={t('project_settings.ai.api_key')}
        info={`${t('common.example')}: ${AI_API_KEY}`}
        className="mt-6"
        value={aiSettings?.api_key ?? ''}
        onChange={(e) =>
          setNewProjectSettings((prev) => {
            if (prev)
              return {
                ...prev,
                ai_settings: {
                  ...aiSettings,
                  api_key: e.target.value,
                },
              }
          })
        }
      />
      <Input
        type="text"
        label={t('project_settings.ai.api_base_url')}
        info={`${t('common.example')}: ${AI_BASE_URL}`}
        className="mt-6"
        value={aiSettings?.api_base_url ?? ''}
        onChange={(e) =>
          setNewProjectSettings((prev) => {
            if (prev)
              return {
                ...prev,
                ai_settings: {
                  ...aiSettings,
                  api_base_url: e.target.value,
                },
              }
          })
        }
      />
      <Input
        type="text"
        label={t('project_settings.ai.model')}
        info={`${t('common.example')}: ${AI_MODEL}`}
        className="mt-6"
        value={aiSettings?.model ?? ''}
        onChange={(e) =>
          setNewProjectSettings((prev) => {
            if (prev)
              return {
                ...prev,
                ai_settings: {
                  ...aiSettings,
                  model: e.target.value,
                },
              }
          })
        }
      />
    </div>
  )
})

export default AITab
