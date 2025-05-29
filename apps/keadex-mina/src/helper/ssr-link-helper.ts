export function generateRemoteDiagramSSRLink(
  projectRootUrl: string,
  diagramUrl: string,
  ghToken?: string,
) {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://keadex.dev'
      : 'http://localhost:4200'

  let link = `${baseUrl}/api/mina-diagram/${btoa(projectRootUrl)}/${btoa(
    diagramUrl,
  )}`
  if (ghToken) {
    link = link.concat(`/${ghToken}`)
  }

  return link
}
