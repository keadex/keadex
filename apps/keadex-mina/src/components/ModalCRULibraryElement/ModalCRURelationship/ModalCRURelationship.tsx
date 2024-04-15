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
          label={`${t('common.description')}`}
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
            disabled:
              !newRelationship?.from ||
              !newRelationship?.to ||
              !newRelationship?.base_data?.label ||
              !newRelationship.relationship_type ||
              !newRelationship.technology,
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
