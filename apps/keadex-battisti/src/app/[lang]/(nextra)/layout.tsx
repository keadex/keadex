import '../../../styles/index.nextra.css'
import './nextra.css'

import { NewsBanner } from '@keadex/keadex-ui-kit/components/cross/NewsBanner/NewsBanner'
import Image from 'next/image'
import Script from 'next/script'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import { LastUpdated, Layout, Navbar } from 'nextra-theme-docs'
import { PropsWithChildren } from 'react'

import keadexLogo from '../../../../public/img/keadex-docs-logo.svg'
import Footer from '../../../components/Footer/Footer'
import NextraLayout from '../../../components/NextraLayout/NextraLayout'
import { SearchNextra } from '../../../components/SearchNextra/SearchNextra'
import { NEWS } from '../../../core/news'
import { fixRoute } from '../../../helper/nextra-helper'

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
}

const navbar = (
  <Navbar
    logo={
      <div className="flex flex-row">
        <a href="/">
          <Image height={24} src={keadexLogo} alt="Keadex Logo" />
        </a>
        <a href="/">Back to Keadex</a>
        {/* <a href="/en/docs/mina">Keadex Mina</a> */}
      </div>
    }
    logoLink={false}
    // ... Your additional navbar options
  />
)

export default async function RootLayout({ children }: PropsWithChildren) {
  // Temporary disable dynamic page map generate through getPageMap Nextra API since it
  // cause issues with css. For some reasons importing getPageMap causes the import
  // of additional tailwindcss CSS but without layers, so the resulting style is broken.
  // All the unlayered css override the layered css.
  // TODO investigate more on this issue and possibly report to Nextra team.
  const pageMap = fixRoute(
    (await getPageMap()).filter(
      (ele) => !('name' in ele && ele.name === '[lang]'),
    ),
  )

  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      {/* Head component causes hydration error: https://github.com/shuding/nextra/issues/4584 */}
      <Head>
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="d12031df-a146-4c32-8276-e1d5c086b932"
          data-blockingmode="auto"
          type="text/javascript"
          async
        />
      </Head>
      <body className="bg-primary text-base nextra-container">
        <NextraLayout>
          <Layout
            banner={
              <Banner>
                <NewsBanner content={NEWS} />
              </Banner>
            }
            navbar={navbar}
            pageMap={pageMap}
            docsRepositoryBase="https://github.com/keadex/keadex/tree/main/apps/keadex-battisti"
            footer={<Footer lang="en" key={'keadex-footer-nextra'} />}
            darkMode={false}
            nextThemes={{ defaultTheme: 'dark' }}
            lastUpdated={
              <LastUpdated>
                <div className="keadex-hide-timestamp"></div>
              </LastUpdated>
            }
            navigation={false}
            copyPageButton={false}
            search={<SearchNextra />}
            // ... Your additional layout options
          >
            {children}
          </Layout>
        </NextraLayout>
      </body>
    </html>
  )
}
