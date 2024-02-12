import { lazy } from 'react'

const MinaReact = lazy(() => import('@keadex/mina-react/dist'))

export function App() {
  return (
    <div className="w-full h-screen">
      <MinaReact
        projectRootUrl="https://raw.githubusercontent.com/keadex/keadex/mina-plugins/examples/mina-react-example/demo_mina_project/Mina%20Demo"
        diagramUrl="https://raw.githubusercontent.com/keadex/keadex/mina-plugins/examples/mina-react-example/demo_mina_project/Mina%20Demo/diagrams/system-context/demo-diagram"
      />
    </div>
  )
}

export default App
