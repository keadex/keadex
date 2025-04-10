import { useConfig } from '@forge/react'
import { useAppBootstrap } from '@keadex/keadex-ui-kit/cross'
import { type MinaMacroConfig } from '@keadex/mina-confluence-plugin'
import MinaReact from '@keadex/mina-react/src/components/MinaReact/MinaReact'

export function App() {
  const configData = useConfig() as MinaMacroConfig | undefined

  async function initializeTailwindElements() {
    const { initTE, Dropdown } = await import('tw-elements')
    await initTE({ Dropdown })
  }

  useAppBootstrap({ initTE: initializeTailwindElements })

  function isNotEmpty(value: string | undefined) {
    return value && value.replace(/ /g, '').length > 0
  }

  let height, ghToken, projectRootUrl, diagramUrl
  if (configData) {
    height = isNotEmpty(configData.height) ? configData.height : undefined
    ghToken = isNotEmpty(configData.ghToken) ? configData.ghToken : undefined
    projectRootUrl = isNotEmpty(configData.projectRootUrl)
      ? configData.projectRootUrl
      : undefined
    diagramUrl = isNotEmpty(configData.diagramUrl)
      ? configData.diagramUrl
      : undefined
  }

  if (projectRootUrl && diagramUrl) {
    return (
      <div
        className="w-full"
        style={{
          height:
            height && height.replace(/ /g, '').length > 0
              ? `${height.replace(/ /g, '')}rem`
              : '50rem',
        }}
      >
        <MinaReact
          projectRootUrl={projectRootUrl}
          diagramUrl={diagramUrl}
          ghToken={ghToken}
        />
      </div>
    )
  } else {
    return (
      <div className="w-full text-center p-10">
        Missing configuration. Add the Keadex Mina diagram URLs to the
        Confluence macro configuration.
      </div>
    )
  }
}

export default App
