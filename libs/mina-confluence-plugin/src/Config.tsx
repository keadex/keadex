import ForgeUI, { MacroConfig, TextField, render } from '@forge/ui'

export type MinaMacroConfig = {
  projectRootUrl?: string
  diagramUrl?: string
  ghToken?: string
  height?: string
}

const Config = () => {
  return (
    <MacroConfig>
      {/* Form components */}
      <TextField
        name="projectRootUrl"
        label="Mina project root URL (mandatory) - e.g. https://raw.githubusercontent.com/{owner}/{repo}/mina-project"
      />
      <TextField
        name="diagramUrl"
        label="Mina diagram URL (mandatory) - e.g. https://raw.githubusercontent.com/{owner}/{repo}/mina-project/diagrams/system-context/my-diagram"
      />
      <TextField
        name="ghToken"
        label="Required only for private repositories. Refer to the GitHub documentation for details on generating a GitHub token. Ensure you keep it secure and do not share it, as it is SENSITIVE INFORMATION!"
      />
      <TextField name="height" type="number" label="Height in rem (optional)" />
    </MacroConfig>
  )
}

export const config = render(<Config />)
