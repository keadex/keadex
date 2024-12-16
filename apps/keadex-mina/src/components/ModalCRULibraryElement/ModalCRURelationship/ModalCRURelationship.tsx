import {
  RELATIONSHIP_TYPES,
  Relationship,
  RelationshipType,
} from '@keadex/c4-model-ui-kit'
import {
  Input,
  Select,
  Textarea,
  renderButtons,
} from '@keadex/keadex-ui-kit/cross'
import { capitalCase, noCase } from 'change-case'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { ModalCRULibraryElementProps } from '../ModalCRULibraryElements'
import { ALIAS_REGEX, NAME_REGEX } from '../../../constants/regex'

const emptyRelationship: Relationship = {
  base_data: {
    uuid: uuidv4(),
    label: '',
    notes: '',
  },
  from: '',
  to: '',
  technology: '',
}

export const ModalCRURelationship = (props: ModalCRULibraryElementProps) => {
  const { t } = useTranslation()
  const [newRelationship, setNewRelationship] = useState(
    props.libraryElement
      ? (props.libraryElement as Relationship)
      : emptyRelationship,
  )

  function missingRequiredFields() {
    return (
      !newRelationship?.from ||
      !newRelationship?.to ||
      !newRelationship?.base_data?.label ||
      !newRelationship.relationship_type ||
      !newRelationship.technology
    )
  }

  useEffect(() => {
    emptyRelationship.base_data.uuid = uuidv4()
  }, [])

  return (
    <div>
      {/* Modal body */}
      <div className="modal__body">
        <Input
          disabled={true}
          type="text"
          label={`UUID`}
          className="mt-2"
          value={newRelationship?.base_data?.uuid}
        />
        <Input
          disabled={props.libraryElement !== undefined || !props.enableEdit}
          type="text"
          label={`${t('common.from')}*`}
          className="mt-6"
          allowedChars={ALIAS_REGEX}
          info={`${t('common.allowed_pattern')}: ${ALIAS_REGEX}`}
          value={newRelationship?.from}
          onChange={(e) =>
            setNewRelationship({
              ...newRelationship,
              from: e.target.value.replace(' ', ''),
            })
          }
        />
        <Input
          disabled={props.libraryElement !== undefined || !props.enableEdit}
          type="text"
          label={`${t('common.to')}*`}
          className="mt-6"
          allowedChars={ALIAS_REGEX}
          info={`${t('common.allowed_pattern')}: ${ALIAS_REGEX}`}
          value={newRelationship?.to}
          onChange={(e) =>
            setNewRelationship({
              ...newRelationship,
              to: e.target.value.replace(' ', ''),
            })
          }
        />
        <Input
          disabled={!props.enableEdit}
          type="text"
          label={`${t('common.label')}*`}
          className="mt-6"
          allowedChars={NAME_REGEX}
          info={`${t('common.allowed_pattern')}: ${NAME_REGEX}`}
          value={newRelationship?.base_data?.label}
          onChange={(e) =>
            setNewRelationship({
              ...newRelationship,
              base_data: {
                ...newRelationship?.base_data,
                label: e.target.value,
              },
            })
          }
        />
        <Select
          id="type-selector"
          disabled={!props.enableEdit}
          label={`${t('common.type')}*`}
          className="mt-6"
          value={newRelationship?.relationship_type}
          options={[{ label: '', value: '' }].concat([
            ...new Set(
              RELATIONSHIP_TYPES.map((relationshipType) => {
                return {
                  label: capitalCase(noCase(relationshipType)),
                  value: relationshipType,
                }
              }),
            ),
          ])}
          onChange={(e) =>
            setNewRelationship({
              ...newRelationship,
              relationship_type: e.target.value as RelationshipType,
            })
          }
        />
        <Input
          disabled={!props.enableEdit}
          type="text"
          label={`${t('common.technology')}*`}
          className="mt-6"
          allowedChars={NAME_REGEX}
          info={`${t('common.allowed_pattern')}: ${NAME_REGEX}`}
          value={newRelationship?.technology}
          onChange={(e) =>
            setNewRelationship({
              ...newRelationship,
              technology: e.target.value,
            })
          }
        />
        <Textarea
          id="relationship-description"
          disabled={!props.enableEdit}
          label={t('common.description')}
          className="mt-6"
          value={newRelationship?.base_data?.description}
          onChange={(e) =>
            setNewRelationship({
              ...newRelationship,
              base_data: {
                ...newRelationship?.base_data,
                description: e.target.value,
              },
            })
          }
        />
        {props.mode !== 'serializer' && (
          <Textarea
            id="relationship-note"
            disabled={!props.enableEdit}
            label={`${t('common.notes')}`}
            className="mt-6"
            value={newRelationship?.base_data?.notes}
            onChange={(e) =>
              setNewRelationship({
                ...newRelationship,
                base_data: {
                  ...newRelationship?.base_data,
                  notes: e.target.value,
                },
              })
            }
          />
        )}
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
                  props.onElementCreated({ Relationship: newRelationship })
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

export default ModalCRURelationship
