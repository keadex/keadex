import {
  RELATIONSHIP_TYPES,
  Relationship,
  RelationshipType,
  isLegendAlias,
  isRelationshipAlias,
  parseTags,
} from '@keadex/c4-model-ui-kit'
import {
  Autocomplete,
  AutocompleteOption,
  Input,
  Select,
  TagsInput,
  Textarea,
  renderButtons,
} from '@keadex/keadex-ui-kit/cross'
import { capitalCase, noCase } from 'change-case'
import { useEffect, useState, SetStateAction, Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import {
  ModalCRULibraryElementProps,
  normalizeLibraryElement,
  onTagsChanged,
} from '../ModalCRULibraryElements'
import {
  ALIAS_REGEX,
  NAME_EXTENDED_REGEX,
  NAME_REGEX,
} from '../../../constants/regex'

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

const MAX_OPTIONS = 5

export const ModalCRURelationship = (props: ModalCRULibraryElementProps) => {
  const { libraryElement, diagramAliases } = props

  const { t } = useTranslation()
  const [newRelationship, setNewRelationship] = useState(
    libraryElement ? (libraryElement as Relationship) : emptyRelationship,
  )
  const [fromAliasOptions, setFromAliasOptions] = useState<
    AutocompleteOption[]
  >([])
  const [toAliasOptions, setToAliasOptions] = useState<AutocompleteOption[]>([])

  function handleOnTyping(
    setOptions: Dispatch<SetStateAction<AutocompleteOption[]>>,
    addDefaultOption: boolean,
    value: string,
    inputDiagramAliases?: string[],
  ) {
    const _diagramAliases = diagramAliases ?? inputDiagramAliases

    // Default option
    let options = addDefaultOption
      ? [
          {
            label: value,
            value: value,
          },
        ]
      : []

    // Options for each alias
    const filteredAliases = _diagramAliases
      .filter(
        (alias) =>
          !isLegendAlias(alias) &&
          !isRelationshipAlias(alias) &&
          (!value || alias.toLowerCase().includes(value.toLowerCase())),
      )
      .sort((a, b) => a.localeCompare(b))

    options = options.concat(
      filteredAliases.map((alias) => {
        return {
          label: alias,
          value: alias,
        }
      }),
    )

    // Set top x results
    if (options.length >= MAX_OPTIONS) {
      options = options.slice(0, MAX_OPTIONS)
    }

    setOptions(options)
  }

  function missingRequiredFields() {
    return (
      !newRelationship?.from ||
      !newRelationship?.to ||
      !newRelationship?.base_data?.label ||
      !newRelationship.relationship_type
    )
  }

  useEffect(() => {
    emptyRelationship.base_data.uuid = uuidv4()
    handleOnTyping(
      setFromAliasOptions,
      !newRelationship.from || newRelationship.from === '',
      newRelationship.from ?? '',
      diagramAliases,
    )
    handleOnTyping(
      setToAliasOptions,
      !newRelationship.to || newRelationship.to === '',
      newRelationship.to ?? '',
      diagramAliases,
    )
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
        <Autocomplete
          id="rel-from-autocomplete"
          disabled={props.libraryElement !== undefined || !props.enableEdit}
          label={`${t('common.from')}*`}
          className="mt-6"
          allowedChars={ALIAS_REGEX}
          info={`${t('common.allowed_pattern')}: ${ALIAS_REGEX}`}
          value={newRelationship?.from}
          options={fromAliasOptions}
          onChange={(e) => {
            setNewRelationship({
              ...newRelationship,
              from: e.target.value.replace(' ', ''),
            })
          }}
          onDefaultOptionSelected={(value) => {
            setNewRelationship({
              ...newRelationship,
              from: value,
            })
          }}
          onTyping={(value) => {
            handleOnTyping(setFromAliasOptions, true, value)
          }}
        />
        <Autocomplete
          id="rel-to-autocomplete"
          disabled={props.libraryElement !== undefined || !props.enableEdit}
          label={`${t('common.to')}*`}
          className="mt-6"
          allowedChars={ALIAS_REGEX}
          info={`${t('common.allowed_pattern')}: ${ALIAS_REGEX}`}
          value={newRelationship?.to}
          options={toAliasOptions}
          onChange={(e) =>
            setNewRelationship({
              ...newRelationship,
              to: e.target.value.replace(' ', ''),
            })
          }
          onDefaultOptionSelected={(value) => {
            setNewRelationship({
              ...newRelationship,
              to: value,
            })
          }}
          onTyping={(value) => {
            handleOnTyping(setToAliasOptions, true, value)
          }}
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
          label={`${t('common.technology')}`}
          className="mt-6"
          allowedChars={NAME_EXTENDED_REGEX}
          info={`${t('common.allowed_pattern')}: ${NAME_EXTENDED_REGEX}`}
          value={newRelationship?.technology ?? ''}
          onChange={(e) =>
            setNewRelationship({
              ...newRelationship,
              technology: e.target.value,
            })
          }
        />
        <TagsInput
          id="modal-cru-relationship-tags"
          disabled={!props.enableEdit}
          className="mt-6 cursor-text"
          label={t('common.tags')}
          tags={parseTags(newRelationship.base_data.tags) ?? []}
          settings={{
            callbacks: {
              add: (e) => onTagsChanged(e, setNewRelationship),
              remove: (e) => onTagsChanged(e, setNewRelationship),
            },
            maxTags: 5,
            editTags: false,
          }}
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
                  props.onElementCreated({
                    Relationship: normalizeLibraryElement(newRelationship),
                  })
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
