import { C4BaseComponentData } from '../components/C4BaseComponent'
import {
  DIAGRAM_EXTERNAL_LINK_PROTOCOLS,
  DiagramExternalLinkVariables,
} from '../constants/diagram-link'

export function isExternalLink(diagramLink: string) {
  return DIAGRAM_EXTERNAL_LINK_PROTOCOLS.some((protocol) =>
    diagramLink.startsWith(protocol),
  )
}

export function linkLabelFromExternalLink(diagramLink: string) {
  try {
    const url = new URL(diagramLink)
    return `Open Link ${url.host.replace('www.', '')}`
  } catch (e) {
    return 'Open Link'
  }
}

export function externalLinkVariableToPlaceholder(
  variable: DiagramExternalLinkVariables,
) {
  return `<${variable.toString().toUpperCase()}>`
}

export function replaceExternalLinkVariables(
  diagramLink: string,
  rawData?: C4BaseComponentData,
) {
  let newDiagramLink = `${diagramLink}`
  for (const variable in DiagramExternalLinkVariables) {
    switch (variable) {
      case DiagramExternalLinkVariables.Alias.toString(): {
        if (
          newDiagramLink.includes(
            externalLinkVariableToPlaceholder(
              DiagramExternalLinkVariables.Alias,
            ),
          ) &&
          rawData?.base_data?.alias
        ) {
          newDiagramLink = newDiagramLink.replace(
            new RegExp(
              externalLinkVariableToPlaceholder(
                DiagramExternalLinkVariables.Alias,
              ),
              'gi',
            ),
            rawData.base_data.alias,
          )
        }
      }
    }
  }
  return newDiagramLink
}
