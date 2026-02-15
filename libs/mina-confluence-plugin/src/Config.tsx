import { view } from '@forge/bridge'
import ForgeReconciler, {
  Button,
  Label,
  SectionMessage,
  Stack,
  Textfield,
  useConfig,
} from '@forge/react'
import React, { useEffect, useState } from 'react'

import { useSubmit } from './useSubmit'

export type MinaMacroConfig = {
  projectRootUrl?: string
  diagramUrl?: string
  ghToken?: string
  height?: string
}

const Config = () => {
  const [projectRootUrl, setProjectRootUrl] = useState('')
  const [diagramUrl, setDiagramUrl] = useState('')
  const [ghToken, setGhToken] = useState('')
  const [height, setHeight] = useState('')
  const config = useConfig() as MinaMacroConfig | undefined

  const { error, message, submit } = useSubmit()

  useEffect(() => {
    setProjectRootUrl(config?.projectRootUrl ?? '')
    setDiagramUrl(config?.diagramUrl ?? '')
    setGhToken(config?.ghToken ?? '')
    setHeight(config?.height ?? '')
  }, [
    config?.projectRootUrl,
    config?.diagramUrl,
    config?.ghToken,
    config?.height,
  ])

  return (
    <Stack space="space.200">
      {/* projectRootUrl */}
      <Label labelFor="projectRootUrl">
        {
          'Mina project root URL (mandatory) - e.g. https://raw.githubusercontent.com/{owner}/{repo}/mina-project'
        }
      </Label>
      <Textfield
        id="projectRootUrl"
        name="projectRootUrl"
        value={projectRootUrl}
        onChange={(e) => setProjectRootUrl(e.target.value)}
      />

      {/* diagramUrl */}
      <Label labelFor="diagramUrl">
        {
          'Mina diagram URL (mandatory) - e.g. https://raw.githubusercontent.com/{owner}/{repo}/mina-project/diagrams/system-context/my-diagram'
        }
      </Label>
      <Textfield
        id="diagramUrl"
        name="diagramUrl"
        value={diagramUrl}
        onChange={(e) => setDiagramUrl(e.target.value)}
      />

      {/* ghToken */}
      <Label labelFor="ghToken">
        {
          'Required only for private repositories. Refer to the GitHub documentation for details on generating a GitHub token. Ensure you keep it secure and do not share it, as it is SENSITIVE INFORMATION!'
        }
      </Label>
      <Textfield
        id="ghToken"
        name="ghToken"
        value={ghToken}
        onChange={(e) => setGhToken(e.target.value)}
      />

      {/* height */}
      <Label labelFor="height">{'Height in rem (optional)'}</Label>
      <Textfield
        name="height"
        id="height"
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />

      {/* Buttons */}
      <Button appearance="subtle" onClick={() => view.close()}>
        Close
      </Button>
      <Button
        appearance="primary"
        onClick={() => submit({ projectRootUrl, diagramUrl, ghToken, height })}
      >
        Submit
      </Button>

      {error && <SectionMessage appearance={'error'}>{message}</SectionMessage>}
    </Stack>
  )
}

ForgeReconciler.render(
  <React.StrictMode>
    <Config />
  </React.StrictMode>,
)
