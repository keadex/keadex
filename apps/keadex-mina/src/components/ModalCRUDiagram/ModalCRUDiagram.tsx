import {
  AUTO_LAYOUT_ORIENTATIONS,
  DIAGRAM_TYPES,
  Diagram,
  DiagramOrientation,
  DiagramType,
  diagramTypeHumanName,
} from '@keadex/c4-model-ui-kit'
import {
  ButtonProps,
  Input,
  Radio,
  Select,
  TagsInput,
  Textarea,
  renderButtons,
} from '@keadex/keadex-ui-kit/cross'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import { NAME_REGEX } from '../../constants/regex'
import {
  createDiagram,
  executeHook,
  getDiagram,
  saveSpecDiagramRawPlantuml,
} from '../../core/tauri-rust-bridge'
import { MinaError } from '../../models/autogenerated/MinaError'

export interface ModalCRUDiagramProps {
  mode: 'create' | 'edit' | 'duplicate' | 'readonly'
  diagramName?: string
  diagramType?: DiagramType
  hideModal: () => void
  forceUpdate: () => void
}

const emptyDiagram: Diagram = {
  diagram_name: '',
  diagram_type: DIAGRAM_TYPES[0],
  diagram_spec: {
    uuid: uuidv4(),
    tags: [],
    shapes: [],
    elements_specs: [],
    auto_layout_enabled: true,
    auto_layout_orientation: 'TopToBottom',
    auto_layout_only_straight_arrows: false,
    grid_enabled: false,
  },
}

export const ModalCRUDiagram = (props: ModalCRUDiagramProps) => {
  const { t } = useTranslation()
  const [newDiagram, setNewDiagram] = useState(emptyDiagram)
  const [newDiagramTags, setNewDiagramTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (props.diagramName && props.diagramType) {
      getDiagram(props.diagramName, props.diagramType).then((diagram) => {
        setNewDiagram(diagram)
        setNewDiagramTags(diagram.diagram_spec?.tags ?? [])
      })
    }
  }, [props.diagramName, props.diagramType])

  function handleConfirmClick() {
    const diagram: Diagram = {
      ...newDiagram,
      diagram_spec: {
        ...newDiagram.diagram_spec!,
        tags: newDiagramTags,
      },
    }

    if (props.mode === 'create' || props.mode === 'duplicate') {
      setIsLoading(true)
      createDiagram(diagram)
        .then((success) => {
          setIsLoading(false)
          if (success) {
            toast.info(t('common.info.done'))
            executeHook({
              data: { Diagram: diagram },
              hook_type: 'onDiagramCreated',
            })
            props.forceUpdate()
            props.hideModal()
          }
        })
        .catch((error: MinaError) => {
          setIsLoading(false)
          toast.error(error.msg)
        })
    } else if (props.mode === 'edit') {
      if (
        diagram.diagram_name &&
        diagram.diagram_type &&
        diagram.raw_plantuml &&
        diagram.diagram_spec
      ) {
        setIsLoading(true)
        saveSpecDiagramRawPlantuml(
          diagram.diagram_name,
          diagram.diagram_type,
          diagram.raw_plantuml,
          diagram.diagram_spec,
        )
          .then(() => {
            setIsLoading(false)
            toast.info(t('common.info.done'))
            executeHook({
              data: { Diagram: diagram },
              hook_type: 'onDiagramSaved',
            })
            props.forceUpdate()
            props.hideModal()
          })
          .catch((error: MinaError) => {
            setIsLoading(false)
            toast.error(error.msg)
          })
      }
    }
  }

  function onTagsChanged(
    event: CustomEvent<Tagify.AddEventData<Tagify.TagData>>,
  ) {
    setNewDiagramTags(event.detail.tagify.value.map((value) => value.value))
  }

  return (
    <div>
      {/* Modal body */}
      <div className="modal__body flex flex-col">
        <span className="text-brand1 font-bold text-lg">
          {t('common.general')}
        </span>
        <Input
          type="text"
          disabled={props.mode === 'edit' || props.mode === 'readonly'}
          label={`${t('common.name')}*`}
          classNameRoot="mt-2"
          value={newDiagram.diagram_name}
          allowedChars={NAME_REGEX}
          info={`${t('common.allowed_pattern')}: ${NAME_REGEX}`}
          onChange={(e) =>
            setNewDiagram({
              ...newDiagram,
              diagram_name: e.target.value,
            })
          }
        />
        <Select
          id="diagram-type-selector"
          disabled={props.mode === 'edit' || props.mode === 'readonly'}
          label={`${t('common.type')}*`}
          className="mt-6"
          value={newDiagram.diagram_type}
          options={DIAGRAM_TYPES.map((diagramType) => {
            return {
              label: diagramTypeHumanName(diagramType),
              value: diagramType,
            }
          })}
          onChange={(e) =>
            setNewDiagram({
              ...newDiagram,
              diagram_type: e.target.value as DiagramType,
            })
          }
        />
        <Textarea
          disabled={props.mode === 'readonly'}
          label={`${t('common.description')}`}
          classNameRoot="mt-6"
          value={newDiagram.diagram_spec?.description ?? ''}
          onChange={(e) =>
            setNewDiagram({
              ...newDiagram,
              diagram_spec: {
                ...newDiagram.diagram_spec!,
                description: e.target.value,
              },
            })
          }
        />
        <TagsInput
          disabled={props.mode === 'readonly'}
          id="diagram-tags"
          className="mt-6"
          label={t('common.tags')}
          tags={newDiagramTags}
          settings={{
            callbacks: {
              add: onTagsChanged,
              remove: onTagsChanged,
            },
            editTags: false,
          }}
        />
        <span
          className={`text-brand1 font-bold mt-6 text-lg ${
            props.mode === 'edit' || props.mode === 'readonly' ? 'hidden' : ''
          }`}
        >
          {t('common.auto_layout')}
        </span>
        <div
          className={`flex flex-row mt-5 ${
            props.mode === 'edit' || props.mode === 'readonly' ? 'hidden' : ''
          }`}
        >
          <span>{`${t('common.enabled')}*`}:</span>
          <Radio<boolean>
            id="autolayout-status"
            className="ml-5"
            value={newDiagram.diagram_spec?.auto_layout_enabled}
            options={[
              { label: t('common.yes'), value: true },
              { label: t('common.no'), value: false },
            ]}
            onChange={(value: boolean) => {
              setNewDiagram({
                ...newDiagram,
                diagram_spec: {
                  ...newDiagram.diagram_spec!,
                  auto_layout_enabled: value,
                },
              })
            }}
          />
        </div>
        <div
          className={`flex flex-row mt-5 ${
            props.mode === 'edit' || props.mode === 'readonly' ? 'hidden' : ''
          }`}
        >
          <span>{`${t('diagrams_settings.gen_only_straight_arrows')}*`}:</span>
          <Radio<boolean>
            id="autolayout-straight-arrows-status"
            className="ml-5"
            value={newDiagram.diagram_spec?.auto_layout_only_straight_arrows}
            options={[
              { label: t('common.yes'), value: true },
              { label: t('common.no'), value: false },
            ]}
            onChange={(value: boolean) => {
              setNewDiagram({
                ...newDiagram,
                diagram_spec: {
                  ...newDiagram.diagram_spec!,
                  auto_layout_only_straight_arrows: value,
                },
              })
            }}
          />
        </div>
        <Select
          id="autolayout-orientation-selector"
          label={`${t('common.orientation')}*`}
          className={`mt-8 ${
            props.mode === 'edit' || props.mode === 'readonly' ? 'hidden' : ''
          }`}
          value={newDiagram.diagram_spec?.auto_layout_orientation}
          options={AUTO_LAYOUT_ORIENTATIONS.map((orientation) => {
            return {
              label: orientation,
              value: orientation,
            }
          })}
          onChange={(e) =>
            setNewDiagram({
              ...newDiagram,
              diagram_spec: {
                ...newDiagram.diagram_spec!,
                auto_layout_orientation: e.target.value as DiagramOrientation,
              },
            })
          }
        />
      </div>

      {/* Modal footer */}
      <div className="modal__footer">
        {renderButtons(
          [
            {
              key: 'button-cancel',
              disabled: isLoading,
              children: <span>{t('common.cancel')}</span>,
              'data-te-modal-dismiss': true,
            } as ButtonProps,
          ].concat(
            props.mode !== 'readonly'
              ? [
                  {
                    key: 'button-create',
                    children: (
                      <span>
                        {props.mode === 'edit'
                          ? t(`common.save`)
                          : t(`common.${props.mode}`)}
                      </span>
                    ),
                    disabled:
                      !newDiagram.diagram_name || !newDiagram.diagram_type,
                    isLoading,
                    onClick: handleConfirmClick,
                  },
                ]
              : [],
          ),
        )}
      </div>
    </div>
  )
}

export default ModalCRUDiagram
