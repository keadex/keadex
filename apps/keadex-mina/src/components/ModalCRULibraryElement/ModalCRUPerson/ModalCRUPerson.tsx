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
import { createPerson, updatePerson } from '../../../core/tauri-rust-bridge'
import { MinaError } from '../../../models/autogenerated/MinaError'
import { Project } from '../../../models/autogenerated/Project'
import DiagramPicker from '../../DiagramPicker/DiagramPicker'
import { ModalCRULibraryElementProps } from '../ModalCRULibraryElements'

const emptyPerson: Person = {
  base_data: {
    uuid: uuidv4(),
    alias: '',
    label: '',
    description: '',
    link: '',
    notes: '',
  },
}

export const ModalCRUPerson = (props: ModalCRULibraryElementProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [newPerson, setNewPerson] = useState(
    props.libraryElement ? (props.libraryElement as Person) : emptyPerson
  )

  function handleUpdatePerson() {
    updatePerson(newPerson as Person)
      .then((updatedProjectLibrary) => {
        if (props.project?.project_settings && props.project?.project_library) {
          const newProject: Project = {
            ...props.project,
            project_library: updatedProjectLibrary,
          }
          dispatch(saveProject(newProject))
          toast.info(t('common.info.done'))
          props.forceUpdate()
          props.hideModal()
        }
      })
      .catch((error: MinaError) => {
        toast.error(error.msg ?? error)
      })
  }

  function handleCreatePerson() {
    createPerson(newPerson as Person)
      .then((updatedProjectLibrary) => {
        if (props.project?.project_settings && props.project?.project_library) {
          const newProject: Project = {
            ...props.project,
            project_library: updatedProjectLibrary,
          }
          dispatch(saveProject(newProject))
          toast.info(t('common.info.done'))
          props.forceUpdate()
          props.hideModal()
        }
      })
      .catch((error: MinaError) => {
        toast.error(error.msg ?? error)
      })
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
          disabled={!props.enableEdit}
          type="text"
          label={`${t('common.alias')}*`}
          className="mt-6"
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
            })
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
          label={`${t('common.description')}*`}
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
        <DiagramPicker
          disabled={!props.enableEdit}
          value={newPerson?.base_data?.link}
          onDiagramSelected={(diagram) => {
            setNewPerson({
              ...newPerson,
              base_data: {
                ...newPerson?.base_data,
                link: diagram,
              },
            })
          }}
        />
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
              !newPerson?.base_data?.alias ||
              !newPerson?.base_data?.label ||
              !newPerson.person_type ||
              !newPerson.base_data.description,
            onClick: () => {
              if (props.project) {
                if (props.libraryElement) {
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
