import {
  faFloppyDisk,
  faShareNodes,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { Diagram, diagramTypeHumanName } from '@keadex/c4-model-ui-kit'
import {
  IconButton,
  Tags,
  useForceUpdate,
  useModal,
} from '@keadex/keadex-ui-kit/cross'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'tw-elements'
import ModalCRUDiagram from '../ModalCRUDiagram/ModalCRUDiagram'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { toast } from 'react-toastify'
import { generateDiagramDeepLink } from '../../helper/deep-link-helper'

export interface DiagramEditorToolbarProps {
  diagram?: Diagram
  saveDiagram: () => void
  closeDiagram: () => void
}

const styleButton =
  'container-link-bg hover:bg-secondary disabled:hover:bg-transparent w-10 h-10'

export const DiagramEditorToolbar = (props: DiagramEditorToolbarProps) => {
  const { diagram } = props

  const { t } = useTranslation()
  const { forceUpdate } = useForceUpdate()
  const { modal, showModal, hideModal } = useModal()

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-te-toggle="tooltip"]'),
    )
    tooltipTriggerList.map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl, { trigger: 'hover' }),
    )
  }, [])

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-te-toggle="tooltip"]'),
    )

    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      const instance = Tooltip.getInstance(tooltipTriggerEl)
      instance?.enable()
      instance?.hide()
    })
  })

  function handleProjectInfoClick() {
    if (diagram && diagram.diagram_type && diagram.diagram_name) {
      showModal({
        id: `showInfoDiargamModal`,
        title: `${diagramTypeHumanName(diagram.diagram_type)} ${t(
          'common.diagram',
        )} - ${diagram.diagram_name}`,
        body: (
          <ModalCRUDiagram
            diagramName={diagram.diagram_name}
            diagramType={diagram.diagram_type}
            mode="readonly"
            hideModal={hideModal}
            forceUpdate={forceUpdate}
          />
        ),
        buttons: false,
      })
    }
  }

  async function handleShareDiagramDeepLink() {
    if (diagram?.diagram_name && diagram?.diagram_type) {
      const deepLink = await generateDiagramDeepLink(
        diagram?.diagram_name,
        diagram?.diagram_type,
      )
      writeText(deepLink)
      toast.info(t('common.info.copied_to_clipboard'))
    }
  }

  return (
    <div id="diagram-editor-toolbar" className="w-full z-[6] flex">
      {modal}
      <div className="py-1 px-3">
        <div className="h-full flex flex-1 items-center rounded text-sm drop-shadow-md">
          <IconButton
            icon={faFloppyDisk}
            className={`${styleButton}`}
            data-te-toggle="tooltip"
            data-te-placement="bottom"
            title={`${t('common.save').toString()} ${t('common.diagram')
              .toString()
              .toLowerCase()}`}
            onClick={() => {
              props.saveDiagram()
            }}
          />
          <IconButton
            icon={faShareNodes}
            className={`${styleButton}`}
            data-te-toggle="tooltip"
            data-te-placement="bottom"
            title={t('diagram_editor.share_deep_link')}
            onClick={handleShareDiagramDeepLink}
          />
          <IconButton
            icon={faXmark}
            className={`${styleButton} hover:!bg-red-600`}
            data-te-toggle="tooltip"
            data-te-placement="bottom"
            title={`${t('common.close').toString()} ${t('common.diagram')
              .toString()
              .toLowerCase()}`}
            onClick={() => {
              props.closeDiagram()
            }}
          />
        </div>
      </div>
      {diagram && diagram.diagram_type && (
        <div
          className="w-full flex flex-col items-center py-1 pr-3 cursor-pointer"
          onClick={handleProjectInfoClick}
        >
          <div className="flex w-full my-auto">
            <div className="text-lg grow truncate">
              {diagramTypeHumanName(diagram.diagram_type)} {t('common.diagram')}{' '}
              - {diagram.diagram_name}
            </div>
            {diagram.diagram_spec?.tags && (
              <div>
                <Tags
                  tags={diagram.diagram_spec.tags}
                  className="float-right top-1/2 -translate-y-1/2"
                />
              </div>
            )}
          </div>
          {diagram.diagram_spec?.description && (
            <div className="w-full text-sm line-clamp-3">
              {diagram.diagram_spec?.description}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DiagramEditorToolbar
