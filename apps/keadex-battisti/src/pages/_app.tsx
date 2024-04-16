import type { AppProps } from 'next/app'
import '../styles/index.css'
import '../styles/nextra.css'
import { useAppBootstrap } from '@keadex/keadex-ui-kit/cross'
import {
  MenuItem,
  useNextraSidebarWorkaround,
} from '../hooks/useNextraSidebarWorkaround/useNextraSidebarWorkaround'

//---------- Disable debug and log levels in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {
    // do nothing
  }
  console.debug = () => {
    // do nothing
  }
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  const sidebar: MenuItem[] = [
    {
      title: 'Overview',
      href: '/en/docs',
    },
    {
      title: 'Keadex Mina',
      href: '/en/docs/mina',
      children: [
        {
          title: 'Introduction',
          href: '/en/docs/mina',
        },
        {
          title: 'Plugins',
          children: [
            {
              title: 'Confluence',
              href: '/en/docs/mina/plugins/confluence',
            },
          ],
        },
      ],
    },
  ]

  useAppBootstrap({ initGA: true })
  useNextraSidebarWorkaround({ menu: sidebar })

  return (
    <div className="bg-primary text-base nextra-container">
      <Component {...pageProps} />
    </div>
  )
}
