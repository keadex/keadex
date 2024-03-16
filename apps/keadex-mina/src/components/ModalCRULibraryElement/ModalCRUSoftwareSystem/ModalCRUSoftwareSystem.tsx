import {
  SYSTEM_TYPES,
  SoftwareSystem,
  SystemType,
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
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch } from '../../../core/store/hooks'
import { saveProject } from '../../../core/store/slices/project-slice'
import {
  createSoftwareSystem,
  updateSoftwareSystem,
} from '../../../core/tauri-rust-bridge'
import { MinaError } from '../../../models/autogenerated/MinaError'
import { Project } from '../../../models/autogenerated/Project'
import DiagramPicker from '../../DiagramPicker/DiagramPicker'
import { ModalCRULibraryElementProps } from '../ModalCRULibraryElements'

const emptySoftwareSystem: SoftwareSystem = {
  base_data: {
    uuid: uuidv4(),
    alias: '',
    label: '',
    description: '',
    notes: '',
  },
}

export const ModalCRUSoftwareSystem = (props: ModalCRULibraryElementProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [newSoftwareSystem, setNewSoftwareSystem] = useState(
    props.libraryElement
      ? (props.libraryElement as SoftwareSystem)
      : emptySoftwareSystem,
  )

  function handleUpdateSoftwareSystem() {
    console.log('updaaaa')
    console.log(newSoftwareSystem)
    updateSoftwareSystem(newSoftwareSystem as SoftwareSystem)
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

  function handleCreateSoftwareSystem() {
    createSoftwareSystem(newSoftwareSystem as SoftwareSystem)
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
    emptySoftwareSystem.base_data.uuid = uuidv4()
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
          value={newSoftwareSystem?.base_data?.uuid}
        />
        <Input
          disabled={!props.enableEdit}
          type="text"
          label={`${t('common.alias')}*`}
          className="mt-6"
          value={newSoftwareSystem?.base_data?.alias}
          onChange={(e) =>
            setNewSoftwareSystem({
              ...newSoftwareSystem,
              base_data: {
                ...newSoftwareSystem?.base_data,
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
          value={newSoftwareSystem?.base_data?.label}
          onChange={(e) =>
            setNewSoftwareSystem({
              ...newSoftwareSystem,
              base_data: {
                ...newSoftwareSystem?.base_data,
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
          value={newSoftwareSystem?.system_type}
          options={[{ label: '', value: '' }].concat([
            ...new Set(
              SYSTEM_TYPES.map((softwareSystemType) => {
                return {
                  label: capitalCase(noCase(softwareSystemType)),
                  value: softwareSystemType,
                }
              }),
            ),
          ])}
          onChange={(e) =>
            setNewSoftwareSystem({
              ...newSoftwareSystem,
              system_type: e.target.value as SystemType,
            })
          }
        />
        <Textarea
          id="software-system-description"
          disabled={!props.enableEdit}
          label={`${t('common.description')}*`}
          className="mt-6"
          value={newSoftwareSystem?.base_data?.description}
          onChange={(e) =>
            setNewSoftwareSystem({
              ...newSoftwareSystem,
              base_data: {
                ...newSoftwareSystem?.base_data,
                description: e.target.value,
              },
            })
          }
        />
        <DiagramPicker
          disabled={!props.enableEdit}
          value={newSoftwareSystem?.base_data?.link}
          onDiagramSelected={(diagram) => {
            setNewSoftwareSystem({
              ...newSoftwareSystem,
              base_data: {
                ...newSoftwareSystem?.base_data,
                link: diagram,
              },
            })
          }}
        />
        <Textarea
          id="software-system-note"
          disabled={!props.enableEdit}
          label={`${t('common.notes')}`}
          className="mt-6"
          value={newSoftwareSystem?.base_data?.notes}
          onChange={(e) =>
            setNewSoftwareSystem({
              ...newSoftwareSystem,
              base_data: {
                ...newSoftwareSystem?.base_data,
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
              !newSoftwareSystem?.base_data?.alias ||
              !newSoftwareSystem?.base_data?.label ||
              !newSoftwareSystem.system_type ||
              !newSoftwareSystem.base_data.description,
            onClick: () => {
              if (props.project) {
                if (props.libraryElement) {
                  handleUpdateSoftwareSystem()
                } else {
                  handleCreateSoftwareSystem()
                }
              }
            },
          },
        ])}
      </div>
    </div>
  )
}

export default ModalCRUSoftwareSystem