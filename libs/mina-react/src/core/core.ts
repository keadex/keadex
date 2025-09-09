import { Diagram, DiagramsThemeSettings } from '@keadex/c4-model-ui-kit'
import {
  diagram_plantuml_url_from_diagram_url,
  diagram_spec_url_from_diagram_url,
  project_settings_url,
  open_remote_diagram,
  ProjectSettings,
} from '../../src-rust/pkg'

export async function fetchGhRawFile(url: string, ghToken?: string) {
  // The following check is required to reduce the load on the Keadex backend.
  if (ghToken) {
    // Use the Keadex API as a proxy only when a GitHub token is configured.
    // In this case, in fact, you have to invoke the GitHub endpoint by passing
    // the token in the "Authorization" header, which is allowed only on server-side.
    const apiUrl = 'https://keadex.dev/api/download-gh-raw-file'
    const headers: {
      headers: { 'Keadex-Gh-Url': string; 'Keadex-Gh-Authorization'?: string }
    } = {
      headers: {
        'Keadex-Gh-Url': url,
      },
    }
    if (ghToken) {
      headers.headers['Keadex-Gh-Authorization'] = ghToken
    }
    return await fetch(apiUrl, headers)
  } else {
    return await fetch(url)
  }
}

export async function downloadDiagramData(
  projectRootUrl: string,
  diagramUrl: string,
  ghToken?: string,
): Promise<
  { projectSettingsJson: string; plantuml: string; spec: string } | undefined
> {
  let projectSettingsUrl
  let plantumlUrl
  let specUrl
  try {
    projectSettingsUrl = project_settings_url(projectRootUrl)
    plantumlUrl = diagram_plantuml_url_from_diagram_url(
      projectRootUrl,
      diagramUrl,
    )
    specUrl = diagram_spec_url_from_diagram_url(projectRootUrl, diagramUrl)
  } catch (e) {
    console.error(e)
    throw new Error(
      'Invalid URL: the provided URL is an invalid Mina project or diagram.',
    )
  }

  if (projectSettingsUrl && plantumlUrl && specUrl) {
    let projectSettingsJson
    let plantuml
    let spec
    try {
      const projectSettingsResponse = await fetchGhRawFile(
        projectSettingsUrl,
        ghToken,
      )
      const plantumlResponse = await fetchGhRawFile(plantumlUrl, ghToken)
      const specResponse = await fetchGhRawFile(specUrl, ghToken)

      if (
        projectSettingsResponse.ok &&
        plantumlResponse.ok &&
        specResponse.ok
      ) {
        projectSettingsJson = await projectSettingsResponse.text()
        plantuml = await plantumlResponse.text()
        spec = await specResponse.text()
        return {
          projectSettingsJson,
          plantuml,
          spec,
        }
      } else {
        throw new Error()
      }
    } catch (e) {
      console.error(e)
      throw new Error(
        'Diagram or project settings not found. Please verify the URLs provided, or, if linking to a private repository, ensure the GitHub token is configured.',
      )
    }
  }
}

export async function openRemoteProjectDiagram(
  projectRootUrl: string,
  diagramUrl: string,
  ghToken?: string,
): Promise<
  | { diagram: Diagram; diagramsThemeSettings?: DiagramsThemeSettings }
  | undefined
> {
  try {
    const diagramData = await downloadDiagramData(
      projectRootUrl,
      diagramUrl,
      ghToken,
    )
    if (diagramData) {
      let diagram = (await open_remote_diagram(
        projectRootUrl,
        diagramUrl,
        diagramData.plantuml,
        diagramData.spec,
      )) as Diagram
      let diagramsThemeSettings = (
        JSON.parse(diagramData.projectSettingsJson) as ProjectSettings
      ).themes_settings?.diagrams_theme_settings
      return { diagram, diagramsThemeSettings }
    }
  } catch (e) {
    console.error(e)
  }
}

export default {
  fetchGhRawFile,
  downloadDiagramData,
  openRemoteProjectDiagram,
}
