import {
  DIAGRAM_EXTERNAL_LINK_PROTOCOLS,
  DIAGRAM_LINKS_SEPARATOR,
  DiagramExternalLinkVariables,
  externalLinkVariableToPlaceholder,
  isExternalLink,
} from '@keadex/c4-model-ui-kit'
import {
  ButtonProps,
  TagsInput,
  renderButtons,
} from '@keadex/keadex-ui-kit/cross'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DiagramPicker from '../DiagramPicker/DiagramPicker'

export type DiagramLinkerProps = {
  className?: string
  diagramPickerClassName?: string
  disabled?: boolean
  link?: string
  hideButtons?: true
  onLinkConfirmed?: (link?: string) => void
  onLinkChanged?: (link?: string) => void
}

export const DiagramLinker = (props: DiagramLinkerProps) => {
  const {
    className,
    diagramPickerClassName,
    disabled,
    link,
    hideButtons,
    onLinkConfirmed,
    onLinkChanged,
  } = props
  const { t } = useTranslation()

  const [internalLink, setInternalLink] = useState(
    extractLinks('internal', link) as string | undefined,
  )
  const [externalLinks, setExternalLinks] = useState(
    (extractLinks('external', link) as string[] | undefined) ?? [],
  )

  function extractLinks(
    typeLink: 'internal' | 'external',
    links?: string,
  ): string | string[] | undefined {
    if (links) {
      const extractedLinks = links
        .split(DIAGRAM_LINKS_SEPARATOR)
        .filter((link) => {
          if (typeLink === 'internal') return !isExternalLink(link)
          else return isExternalLink(link)
        })
      if (typeLink === 'internal' && extractedLinks.length > 0)
        return extractedLinks[0]
      else if (typeLink === 'external') return extractedLinks
    }
    return
  }

  function buildLinkString() {
    const links = []
    if (internalLink) links.push(internalLink)
    if (externalLinks) links.push(...externalLinks)
    return links.length > 0 ? links.join(DIAGRAM_LINKS_SEPARATOR) : undefined
  }

  function onInternalLinkChanged(diagram: string | undefined) {
    setInternalLink(diagram)
  }

  function onExternalLinksChanged(
    event: CustomEvent<Tagify.AddEventData<Tagify.TagData>>,
  ) {
    setExternalLinks(
      event.detail.tagify.value
        .map((value) => value.value)
        .filter((link) => isExternalLink(link)),
    )
  }

  useEffect(() => {
    if (onLinkChanged) {
      onLinkChanged(buildLinkString())
    }
  }, [internalLink, externalLinks])

  return (
    <div>
      {/* Modal Body */}
      <div className={`modal__body ${className ?? ''}`}>
        <div className={`flex flex-col`}>
          <DiagramPicker
            disabled={disabled}
            className={`!mb-0 !mt-4 !p-0 ${diagramPickerClassName ?? ''}`}
            value={internalLink}
            onDiagramSelected={onInternalLinkChanged}
          />
          <TagsInput
            id="diagram-linker-external-links"
            disabled={disabled}
            className="mt-6 cursor-text"
            label={t('common.external_links')}
            tags={externalLinks}
            settings={{
              callbacks: {
                add: onExternalLinksChanged,
                remove: onExternalLinksChanged,
              },
              maxTags: 5,
              editTags: false,
            }}
          />
          <div className="text-sm px-3">
            {t('diagram_editor.external_links_info', {
              maxNumExternalLinks: 5,
              allowedLinks: DIAGRAM_EXTERNAL_LINK_PROTOCOLS.map((protocol) =>
                protocol.replace('://', ''),
              ).join(', '),
              allowedVariables: Object.keys(DiagramExternalLinkVariables)
                .map((variable) =>
                  externalLinkVariableToPlaceholder(
                    variable as DiagramExternalLinkVariables,
                  ),
                )
                .join(', '),
            })}
          </div>
        </div>
      </div>

      {/* Modal footer */}
      {!hideButtons && (
        <div className="modal__footer">
          {renderButtons([
            {
              key: 'button-cancel',
              children: <span>{t('common.cancel')}</span>,
              'data-te-modal-dismiss': true,
            } as ButtonProps,
            {
              key: 'button-create',
              children: <span>{t(`common.confirm`)}</span>,
              onClick: () => {
                if (onLinkConfirmed) onLinkConfirmed(buildLinkString())
              },
            },
          ])}
        </div>
      )}
    </div>
  )
}

export default DiagramLinker
