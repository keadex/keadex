import { PERSON_TYPES, Person, PersonType } from '@keadex/c4-model-ui-kit'
import {
  Input,
  Select,
  Textarea,
  renderButtons,
} from '@keadex/keadex-ui-kit/cross'
import { capitalCase, noCase } from 'change-case'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '../../../core/store/hooks'
import { saveProject } from '../../../core/store/slices/project-slice'
import {
  createLibraryElement,
  updateLibraryElement,
} from '../../../core/tauri-rust-bridge'
import { MinaError } from '../../../models/autogenerated/MinaError'
import { Project } from '../../../models/autogenerated/Project'
import {
  ModalCRULibraryElementProps,
  normalizeLibraryElement,
} from '../ModalCRULibraryElements'
import { ALIAS_REGEX, NAME_REGEX } from '../../../constants/regex'

const emptyPerson: Person = {
  base_data: {
    uuid: uuidv4(),
    alias: '',
    label: '',
    description: '',
    notes: '',
  },
}

export const ModalCRUPerson = (props: ModalCRULibraryElementProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [newPerson, setNewPerson] = useState(
    props.libraryElement ? (props.libraryElement as Person) : emptyPerson,
  )
  const [isLoading, setIsLoading] = useState(false)

  function handleUpdatePerson() {
    setIsLoading(true)
    updateLibraryElement(
      { Person: props.libraryElement as Person },
      { Person: normalizeLibraryElement(newPerson) },
    )
      .then((updatedProjectLibrary) => {
        setIsLoading(false)
        if (props.project?.project_settings && props.project?.project_library) {
          const newProject: Project = {
            ...props.project,
            project_library: updatedProjectLibrary,
          }
          dispatch(saveProject(newProject))
          toast.info(t('common.info.done'))
          if (props.forceUpdate) props.forceUpdate()
          props.hideModal()
        }
      })
      .catch((error: MinaError) => {
        setIsLoading(false)
        toast.error(error.msg ?? error)
      })
  }

  function handleCreatePerson() {
    setIsLoading(true)
    createLibraryElement({ Person: normalizeLibraryElement(newPerson) })
      .then((updatedProjectLibrary) => {
        setIsLoading(false)
        if (props.project?.project_settings && props.project?.project_library) {
          const newProject: Project = {
            ...props.project,
            project_library: updatedProjectLibrary,
          }
          dispatch(saveProject(newProject))
          toast.info(t('common.info.done'))
          if (props.forceUpdate) props.forceUpdate()
          props.hideModal()
        }
      })
      .catch((error: MinaError) => {
        setIsLoading(false)
        toast.error(error.msg ?? error)
      })
  }

  function missingRequiredFields() {
    return (
      !newPerson?.base_data?.alias ||
      !newPerson?.base_data?.label ||
      !newPerson.person_type
    )
  }

  useEffect(() => {
    emptyPerson.base_data.uuid = uuidv4()
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
          value={newPerson?.base_data?.uuid}
        />
        <Input
          disabled={props.libraryElement !== undefined || !props.enableEdit}
          type="text"
          label={`${t('common.alias')}*`}
          className="mt-6"
          allowedChars={ALIAS_REGEX}
          info={`${t('common.allowed_pattern')}: ${ALIAS_REGEX}`}
          value={newPerson?.base_data?.alias}
          onChange={(e) =>
            setNewPerson({
              ...newPerson,
              base_data: {
                ...newPerson?.base_data,
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
          value={newPerson?.base_data?.label}
          onChange={(e) =>
            setNewPerson({
              ...newPerson,
              base_data: {
                ...newPerson?.base_data,
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
          value={newPerson?.person_type}
          options={[{ label: '', value: '' }].concat(
            PERSON_TYPES.map((personType) => {
              return {
                label: capitalCase(noCase(personType)),
                value: personType,
              }
            }),
          )}
          onChange={(e) =>
            setNewPerson({
              ...newPerson,
              person_type: e.target.value as PersonType,
            })
          }
        />
        <Textarea
          disabled={!props.enableEdit}
          label={t('common.description')}
          className="mt-6"
          value={newPerson?.base_data?.description}
          onChange={(e) =>
            setNewPerson({
              ...newPerson,
              base_data: {
                ...newPerson?.base_data,
                description: e.target.value,
              },
            })
          }
        />
        {props.mode !== 'serializer' && (
          <Textarea
            disabled={!props.enableEdit}
            label={`${t('common.notes')}`}
            className="mt-6"
            value={newPerson?.base_data?.notes}
            onChange={(e) =>
              setNewPerson({
                ...newPerson,
                base_data: {
                  ...newPerson?.base_data,
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
            disabled: isLoading,
            children: <span>{t('common.cancel')}</span>,
            'data-te-modal-dismiss': true,
          },
          {
            key: 'button-save',
            children: <span>{t('common.save')}</span>,
            disabled: missingRequiredFields(),
            isLoading,
            onClick: () => {
              if (props.mode === 'serializer') {
                if (props.onElementCreated) {
                  props.onElementCreated({
                    Person: normalizeLibraryElement(newPerson),
                  })
                  props.hideModal()
                }
              } else if (props.project) {
                if (
                  props.libraryElement &&
                  props.mode !== 'createLibraryElement'
                ) {
                  handleUpdatePerson()
                } else {
                  handleCreatePerson()
                }
              }
            },
          },
        ])}
      </div>
    </div>
  )
}

export default ModalCRUPerson
