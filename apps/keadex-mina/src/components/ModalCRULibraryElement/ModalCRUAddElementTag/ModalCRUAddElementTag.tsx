import { AddElementTag } from '@keadex/c4-model-ui-kit'
import { Input, renderButtons } from '@keadex/keadex-ui-kit/cross'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalCRULibraryElementProps } from '../ModalCRULibraryElements'

const emptyAddElementTag: AddElementTag = {
  tag: '',
  bg_color: '',
  font_color: '',
  border_color: '',
  legend_text: '',
}

export const ModalCRUAddElementTag = (props: ModalCRULibraryElementProps) => {
  const { t } = useTranslation()
  const [newAddElementTag, setNewAddElementTag] = useState(
    props.libraryElement
      ? (props.libraryElement as AddElementTag)
      : emptyAddElementTag,
  )

  function missingRequiredFields() {
    return !newAddElementTag?.tag
  }

  return (
    <div>
      {/* Modal body */}
      <div className="modal__body">
        <Input
          disabled={!props.enableEdit}
          type="text"
          label={`${t('common.tag')}*`}
          className="mt-2"
          value={newAddElementTag?.tag}
          onChange={(e) =>
            setNewAddElementTag({
              ...newAddElementTag,
              tag: e.target.value,
            })
          }
        />
        <Input
          disabled={!props.enableEdit}
          type="text"
          label={`${t('plantuml.properties.bg_color')}`}
          className="mt-6"
          value={newAddElementTag?.bg_color}
          onChange={(e) =>
            setNewAddElementTag({
              ...newAddElementTag,
              bg_color: e.target.value,
            })
          }
        />
        <Input
          disabled={!props.enableEdit}
          type="text"
          label={`${t('plantuml.properties.font_color')}`}
          className="mt-6"
          value={newAddElementTag?.font_color}
          onChange={(e) =>
            setNewAddElementTag({
              ...newAddElementTag,
              font_color: e.target.value,
            })
          }
        />
        <Input
          disabled={!props.enableEdit}
          type="text"
          label={`${t('plantuml.properties.border_color')}`}
          className="mt-6"
          value={newAddElementTag?.border_color}
          onChange={(e) =>
            setNewAddElementTag({
              ...newAddElementTag,
              border_color: e.target.value,
            })
          }
        />
        <Input
          disabled={!props.enableEdit}
          type="text"
          label={`${t('plantuml.properties.legend_text')}`}
          className="mt-6"
          value={newAddElementTag?.legend_text}
          onChange={(e) =>
            setNewAddElementTag({
              ...newAddElementTag,
              legend_text: e.target.value,
            })
          }
        />
        <span
          className={`text-sm text-orange-500 mt-2 ${
            missingRequiredFields() ? 'block' : 'hidden'
          }`}
        >
          * {t('common.info.fill_required_fields')}
        </span>
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
            disabled: missingRequiredFields(),
            onClick: () => {
              if (props.mode === 'serializer') {
                if (props.onElementCreated) {
                  props.onElementCreated({ AddElementTag: newAddElementTag })
                  props.hideModal()
                }
              }
            },
          },
        ])}
      </div>
    </div>
  )
}

export default ModalCRUAddElementTag
