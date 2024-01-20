import type { AppProps } from 'next/app'
import '../styles/index.css'
import '../styles/nextra.css'
import { useAppBootstrap } from '@keadex/keadex-ui-kit/cross'

//---------- Disable debug and log levels in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.debug = () => {}
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  useAppBootstrap({ initGA: true })

  return (
    <div className="bg-primary text-base nextra-container">
      <Component {...pageProps} />
    </div>
  )
}
