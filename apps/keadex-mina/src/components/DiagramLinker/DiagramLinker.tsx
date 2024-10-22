import {
  DIAGRAM_LINKS_SEPARATOR,
  isExternalLink,
} from '@keadex/c4-model-ui-kit'
import {
  ButtonProps,
  TagsInput,
  renderButtons,
} from '@keadex/keadex-ui-kit/cross'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import DiagramPicker from '../DiagramPicker/DiagramPicker'

export type DiagramLinkerProps = {
  className?: string
  diagramPickerClassName?: string
  link?: string
  onLinkConfirmed: (link?: string) => void
}

export const DiagramLinker = (props: DiagramLinkerProps) => {
  const { className, diagramPickerClassName, link, onLinkConfirmed } = props
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

  return (
    <div>
      {/* Modal Body */}
      <div className="modal__body">
        <div className={`flex flex-col ${className ?? ''}`}>
          {/* <span>Internal Link</span> */}
          <div className="text-brand1 text-lg">{t('common.internal_link')}</div>
          <DiagramPicker
            className={`!mb-0 !mt-4 !p-0 ${diagramPickerClassName ?? ''}`}
            value={internalLink}
            onDiagramSelected={onInternalLinkChanged}
          />
          <div className="mt-5 text-brand1 text-lg">
            {t('common.external_links')}
          </div>
          <TagsInput
            id="diagram-linker-external-links"
            className="mt-4 cursor-text"
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
            })}
          </div>
        </div>
      </div>

      {/* Modal footer */}
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
              onLinkConfirmed(buildLinkString())
            },
          },
        ])}
      </div>
    </div>
  )
}

export default DiagramLinker
