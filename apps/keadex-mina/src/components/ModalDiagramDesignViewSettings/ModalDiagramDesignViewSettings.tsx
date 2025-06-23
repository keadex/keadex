import { Radio, renderButtons } from '@keadex/keadex-ui-kit/cross'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DiagramDesignViewSettings } from '../../views/DiagramEditor/DiagramDesignView/DiagramDesignView'

export interface ModalDiagramDesignViewSettingsProps {
  settings: DiagramDesignViewSettings
  hideModal: () => void
  onSettingsChanged: (settings: DiagramDesignViewSettings) => void
}

export const ModalDiagramDesignViewSettings = (
  props: ModalDiagramDesignViewSettingsProps,
) => {
  const { t } = useTranslation()
  const [settings, setSettings] = useState(props.settings)

  function handleSaveClick() {
    props.onSettingsChanged(settings)
    props.hideModal()
  }

  return (
    <div>
      {/* Modal body */}
      <div className="modal__body">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <span>{t('diagrams_settings.grid_enabled')}*:</span>
            <Radio<boolean>
              id="autolayout-status"
              className="ml-5"
              value={settings.gridEnabled}
              options={[
                { label: t('common.enabled'), value: true },
                { label: t('common.disabled'), value: false },
              ]}
              onChange={(gridEnabled: boolean) => {
                setSettings({
                  ...settings,
                  gridEnabled,
                })
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal footer */}
      <div className="modal__footer">
        {renderButtons([
          {
            key: 'button-cancel',
            children: <span>{t('common.cancel')}</span>,
            'data-te-modal-dismiss': true,
          },
          {
            key: 'button-save',
            children: <span>{t('common.save')}</span>,
            onClick: handleSaveClick,
          },
        ])}
      </div>
    </div>
  )
}

export default ModalDiagramDesignViewSettings
