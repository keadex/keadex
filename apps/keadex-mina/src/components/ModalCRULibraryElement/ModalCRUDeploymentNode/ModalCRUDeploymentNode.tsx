import {
  DEPLOYMENT_NODE_TYPES,
  DeploymentNode,
  DeploymentNodeType,
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

const emptyDeploymentNode: DeploymentNode = {
  base_data: {
    uuid: uuidv4(),
    alias: '',
    label: '',
    notes: '',
  },
  sub_elements: [],
}

export const ModalCRUDeploymentNode = (props: ModalCRULibraryElementProps) => {
  const { t } = useTranslation()
  const [newDeploymentNode, setNewDeploymentNode] = useState(
    props.libraryElement
      ? (props.libraryElement as DeploymentNode)
      : emptyDeploymentNode,
  )

  function missingRequiredFields() {
    return (
      !newDeploymentNode?.base_data?.alias ||
      !newDeploymentNode?.base_data?.label ||
      !newDeploymentNode.deployment_node_type
    )
  }

  useEffect(() => {
    emptyDeploymentNode.base_data.uuid = uuidv4()
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
          value={newDeploymentNode?.base_data?.uuid}
        />
        <Input
          disabled={props.libraryElement !== undefined || !props.enableEdit}
          type="text"
          label={`${t('common.alias')}*`}
          className="mt-6"
          allowedChars={ALIAS_REGEX}
          info={`${t('common.allowed_pattern')}: ${ALIAS_REGEX}`}
          value={newDeploymentNode?.base_data?.alias}
          onChange={(e) =>
            setNewDeploymentNode({
              ...newDeploymentNode,
              base_data: {
                ...newDeploymentNode?.base_data,
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
          value={newDeploymentNode?.base_data?.label}
          onChange={(e) =>
            setNewDeploymentNode({
              ...newDeploymentNode,
              base_data: {
                ...newDeploymentNode?.base_data,
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
          value={newDeploymentNode?.deployment_node_type}
          options={[{ label: '', value: '' }].concat([
            ...new Set(
              DEPLOYMENT_NODE_TYPES.map((deploymentNodeType) => {
                return {
                  label: capitalCase(noCase(deploymentNodeType)),
                  value: deploymentNodeType,
                }
              }),
            ),
          ])}
          onChange={(e) =>
            setNewDeploymentNode({
              ...newDeploymentNode,
              deployment_node_type: e.target.value as DeploymentNodeType,
            })
          }
        />
        {props.mode !== 'serializer' && (
          <Textarea
            id="deployment-node-note"
            disabled={!props.enableEdit}
            label={`${t('common.notes')}`}
            className="mt-6"
            value={newDeploymentNode?.base_data?.notes}
            onChange={(e) =>
              setNewDeploymentNode({
                ...newDeploymentNode,
                base_data: {
                  ...newDeploymentNode?.base_data,
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
                  props.onElementCreated({ DeploymentNode: newDeploymentNode })
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

export default ModalCRUDeploymentNode
