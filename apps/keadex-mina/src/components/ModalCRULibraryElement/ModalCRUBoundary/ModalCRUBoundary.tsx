import { BOUNDARY_TYPES, Boundary, BoundaryType } from '@keadex/c4-model-ui-kit'
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
import { ALIAS_REGEX, NAME_REGEX } from '../../../constants/regex'
import { ModalCRULibraryElementProps } from '../ModalCRULibraryElements'
import DiagramLinker from '../../DiagramLinker/DiagramLinker'

const emptyBoundary: Boundary = {
  base_data: {
    uuid: uuidv4(),
    alias: '',
    label: '',
    notes: '',
  },
  sub_elements: [],
}

export const ModalCRUBoundary = (props: ModalCRULibraryElementProps) => {
  const { t } = useTranslation()
  const [newBoundary, setNewBoundary] = useState(
    props.libraryElement ? (props.libraryElement as Boundary) : emptyBoundary,
  )

  useEffect(() => {
    emptyBoundary.base_data.uuid = uuidv4()
  }, [])

  function missingRequiredFields() {
    return (
      !newBoundary?.base_data?.alias ||
      !newBoundary?.base_data?.label ||
      !newBoundary.boundary_type
    )
  }

  return (
    <div>
      {/* Modal body */}
      <div className="modal__body">
        <Input
          disabled={true}
          type="text"
          label={`UUID`}
          className="mt-2"
          value={newBoundary?.base_data?.uuid}
        />
        <Input
          disabled={props.libraryElement !== undefined || !props.enableEdit}
          type="text"
          label={`${t('common.alias')}*`}
          className="mt-6"
          allowedChars={ALIAS_REGEX}
          info={`${t('common.allowed_pattern')}: ${ALIAS_REGEX}`}
          value={newBoundary?.base_data?.alias}
          onChange={(e) =>
            setNewBoundary({
              ...newBoundary,
              base_data: {
                ...newBoundary?.base_data,
                alias: e.target.value.replace(' ', ''),
              },
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
          value={newBoundary?.base_data?.label}
          onChange={(e) =>
            setNewBoundary({
              ...newBoundary,
              base_data: {
                ...newBoundary?.base_data,
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
          value={newBoundary?.boundary_type}
          options={[{ label: '', value: '' }].concat([
            ...new Set(
              BOUNDARY_TYPES.map((boundaryType) => {
                return {
                  label: capitalCase(noCase(boundaryType)),
                  value: boundaryType,
                }
              }),
            ),
          ])}
          onChange={(e) =>
            setNewBoundary({
              ...newBoundary,
              boundary_type: e.target.value as BoundaryType,
            })
          }
        />
        <DiagramLinker
          hideButtons
          className="p-0"
          disabled={!props.enableEdit}
          link={newBoundary?.base_data?.link}
          onLinkChanged={(link) => {
            setNewBoundary({
              ...newBoundary,
              base_data: {
                ...newBoundary?.base_data,
                link,
              },
            })
          }}
        />
        {props.mode !== 'serializer' && (
          <Textarea
            id="boundary-note"
            disabled={!props.enableEdit}
            label={`${t('common.notes')}`}
            className="mt-6"
            value={newBoundary?.base_data?.notes}
            onChange={(e) =>
              setNewBoundary({
                ...newBoundary,
                base_data: {
                  ...newBoundary?.base_data,
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
                  props.onElementCreated({ Boundary: newBoundary })
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

export default ModalCRUBoundary
