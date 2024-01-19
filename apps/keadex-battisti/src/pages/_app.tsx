import type { AppProps } from 'next/app'
import { useGoogleAnalytics } from '@keadex/keadex-ui-kit/web'
import '../styles/index.css'
import '../styles/nextra.css'

//---------- Disable debug and log levels in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.debug = () => {}
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  useGoogleAnalytics()

  return (
    <div className="bg-primary text-base nextra-container">
      <Component {...pageProps} />
    </div>
  )
}
