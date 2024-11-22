import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import SplashScreen from './components/SplashScreen/SplashScreen'

// const TestSuspense = () => {
//   const [ready, setReady] = useState(false)

//   useEffect(() => {
//     setTimeout(() => setReady(true), 1000)
//   }, [])

//   const SuspenseTrigger = () => {
//     throw new Promise(() => {
//       //
//     })
//   }

//   return ready ? <div>hello world!</div> : <SuspenseTrigger />
// }

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<SplashScreen />}>
      <App />
      {/* <TestSuspense /> */}
    </Suspense>
  </React.StrictMode>,
)
