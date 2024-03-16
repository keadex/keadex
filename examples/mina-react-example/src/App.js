import '@keadex/mina-react/main.css'
import MinaReact from '@keadex/mina-react'

export function App() {
  return (
    <div className="w-full h-screen">
      <MinaReact
        projectRootUrl="https://raw.githubusercontent.com/keadex/keadex/main/examples/mina-react-example/demo_mina_project/Mina%20Demo"
        diagramUrl="https://raw.githubusercontent.com/keadex/keadex/main/examples/mina-react-example/demo_mina_project/Mina%20Demo/diagrams/system-context/demo-diagram"
      />
    </div>
  )
}

export default App