import ForgeUI, { MacroConfig, TextField, render } from '@forge/ui'

export type MinaMacroConfig = {
  projectRootUrl?: string
  diagramUrl?: string
  height?: string
}

const Config = () => {
  return (
    <MacroConfig>
      {/* Form components. */}
      <TextField
        name="projectRootUrl"
        label="Mina project root URL (mandatory) - e.g. https://raw.githubusercontent.com/{owner}/{repo}/mina-project"
      />
      <TextField
        name="diagramUrl"
        label="Mina diagram URL (mandatory) - e.g. https://raw.githubusercontent.com/{owner}/{repo}/mina-project/diagrams/system-context/my-diagram"
      />
      <TextField name="height" type="number" label="Height in rem (optional)" />
    </MacroConfig>
  )
}

export const config = render(<Config />)
