import { DiagramType } from '@keadex/c4-model-ui-kit'
import ROUTES, {
  OPEN_DEPENDENCY_TABLE_DEEP_LINK,
  OPEN_DIAGRAM_DEEP_LINK,
  OPEN_REMOTE_DIAGRAM_DEEP_LINK,
} from '../core/router/routes'
import { diagramToLinkString } from '../core/tauri-rust-bridge'

export async function generateDiagramDeepLink(
  diagramHumanName: string,
  diagramType: DiagramType,
) {
  const diagramLink = await diagramToLinkString(diagramHumanName, diagramType)
  return `${ROUTES[OPEN_DIAGRAM_DEEP_LINK].path}${diagramLink}`
}

export function generateDependencyTableDeepLink(alias: string) {
  return `${ROUTES[OPEN_DEPENDENCY_TABLE_DEEP_LINK].path}${alias}`
}

export function generateRemoteDiagramDeepLink(
  projectRootUrl: string,
  diagramUrl: string,
  ghToken?: string,
) {
  let deepLink = `${ROUTES[OPEN_REMOTE_DIAGRAM_DEEP_LINK].path}${btoa(
    projectRootUrl,
  )}/${btoa(diagramUrl)}`
  if (ghToken) {
    deepLink = deepLink.concat(`/${ghToken}`)
  }
  return deepLink
}
