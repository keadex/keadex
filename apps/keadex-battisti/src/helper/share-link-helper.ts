export const PROJECT_ROOT_URL_PARAM_NAME = 'projectRootUrl'
export const DIAGRAM_URL_PARAM_NAME = 'diagramUrl'
export const GH_TOKEN_PARAM_NAME = 'ghToken'

export function generateShareLink(
  projectRootUrl: string,
  diagramUrl: string,
  ghToken?: string,
) {
  const projectRootUrlParam = `${PROJECT_ROOT_URL_PARAM_NAME}=${btoa(
    projectRootUrl,
  )}`
  const diagramUrlParam = `&${DIAGRAM_URL_PARAM_NAME}=${btoa(diagramUrl)}`
  const ghTokenParam = `&${GH_TOKEN_PARAM_NAME}=${ghToken}`
  const link = `${window.location.origin}${
    window.location.pathname
  }?${projectRootUrlParam}${diagramUrlParam}${ghToken ? ghTokenParam : ''}`
  return link
}
