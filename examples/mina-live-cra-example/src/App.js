import '@keadex/mina-live/index.css'
import MinaLive from '@keadex/mina-live'

export function App() {
  return (
    <div className="w-full h-screen">
      <MinaLive
        scriptPath={`${window.location.origin}/static/js/mina_live_worker_wasm.js`}
      />
    </div>
  )
}

export default App
