import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  AUTO_LAYOUT_ORIENTATIONS,
  DiagramOrientation,
} from '@keadex/c4-model-ui-kit'
import { Radio, Select, renderButtons } from '@keadex/keadex-ui-kit/cross'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface ModalAutoLayoutProps {
  enabled: boolean
  orientation: DiagramOrientation
  generateOnlyStraightArrows: boolean
  hideModal: () => void
  onAutoLayoutConfigured: (
    enabled: boolean,
    orientation: DiagramOrientation,
    generateOnlyStraightArrows: boolean,
  ) => void
}

export const ModalAutoLayout = (props: ModalAutoLayoutProps) => {
  const { t } = useTranslation()
  const [enabled, setEnabled] = useState(props.enabled)
  const [orientation, setOrientation] = useState(props.orientation)
  const [generateOnlyStraightArrows, setGenerateOnlyStraightArrows] = useState(
    props.generateOnlyStraightArrows,
  )

  function handleSaveClick() {
    props.onAutoLayoutConfigured(
      enabled,
      orientation,
      generateOnlyStraightArrows,
    )
    props.hideModal()
  }

  return (
    <div>
      {/* Modal body */}
      <div className="modal__body">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <span>{t('common.status')}*:</span>
            <Radio<boolean>
              id="autolayout-status"
              className="ml-5"
              value={enabled}
              options={[
                { label: t('common.enabled'), value: true },
                { label: t('common.disabled'), value: false },
              ]}
              onChange={(value: boolean) => {
                setEnabled(value)
              }}
            />
          </div>
          <span
            className={`text-sm text-orange-500 mt-2 ${
              !props.enabled && enabled ? 'block' : 'hidden'
            }`}
          >
            <FontAwesomeIcon
              icon={faWarning}
              className="mr-1 text-yellow-500"
            />
            {t('diagram_editor.warning_enable_autolayout')}
          </span>
        </div>
        <div className={`flex flex-row mt-5`}>
          <span>{`${t('diagrams_settings.gen_only_straight_arrows')}*`}:</span>
          <Radio<boolean>
            id="autolayout-straight-arrows-status"
            className="ml-5"
            value={generateOnlyStraightArrows}
            options={[
              { label: t('common.yes'), value: true },
              { label: t('common.no'), value: false },
            ]}
            onChange={(value: boolean) => {
              setGenerateOnlyStraightArrows(value)
            }}
          />
        </div>
        <Select
          id="autolayout-orientation-selector"
          label={`${t('common.orientation')}*`}
          className="mt-8"
          value={orientation}
          options={AUTO_LAYOUT_ORIENTATIONS.map((orientation) => {
            return {
              label: orientation,
              value: orientation,
            }
          })}
          onChange={(e) => setOrientation(e.target.value as DiagramOrientation)}
        />
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

export default ModalAutoLayout
