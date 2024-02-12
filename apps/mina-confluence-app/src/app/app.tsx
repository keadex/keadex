import { view } from '@forge/bridge'
import { FullContext } from '@forge/bridge/out/types'
import { useAppBootstrap } from '@keadex/keadex-ui-kit/cross'
import { type MinaMacroConfig } from '@keadex/mina-confluence-plugin'
import MinaReact from '@keadex/mina-react/src/components/MinaReact/MinaReact'
import { useEffect, useState } from 'react'

export function App() {
  async function initializeTailwindElements() {
    const { initTE, Dropdown } = await import('tw-elements')
    await initTE({ Dropdown })
  }

  // const [data, setData] = useState<string | null>(null)
  const [context, setContext] = useState<FullContext | null>(null)

  useEffect(() => {
    view.getContext().then(setContext)
  }, [])

  useAppBootstrap({ initTE: initializeTailwindElements })

  // useEffect(() => {
  //   invoke<string>('getText', { example: 'my-invoke-variable' }).then(setData)
  // }, [])

  let height, projectRootUrl, diagramUrl
  if (context?.extension && context?.extension.config) {
    const config = context?.extension.config as MinaMacroConfig
    height = config.height
    projectRootUrl = config.projectRootUrl
    diagramUrl = config.diagramUrl
  }

  // const height = 'h-[50rem]'
  // const projectRootUrl =
  //   'https://raw.githubusercontent.com/keadex/keadex/mina-plugins/examples/mina-react-example/demo_mina_project/Mina%20Demo'
  // const diagramUrl =
  //   'https://raw.githubusercontent.com/keadex/keadex/mina-plugins/examples/mina-react-example/demo_mina_project/Mina%20Demo/diagrams/system-context/demo-diagram'

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
        <MinaReact projectRootUrl={projectRootUrl} diagramUrl={diagramUrl} />
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
