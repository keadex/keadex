import { dir } from 'i18next'
import dynamic from 'next/dynamic'
import '../../styles/index.css'
import { fallbackLng, languages } from '../i18n/settings'
import { Metadata } from 'next'
import keadexLogo from '../../../public/img/keadex-logo-512x512.png'
import Script from 'next/script'

const Layout = dynamic(() => import('../../components/Layout/Layout'))

export type PageProps = {
  params: Promise<PageParams>
}

export type PageParams = {
  lang: string
}

const seo = {
  title: 'Keadex - Experiment. Learn. Share.',
  description:
    'Keadex is a project that aims to experiment, learn and provide open source solutions. Some of the Keadex projects are experiments, some under development, while others are ready to use open source solutions.',
}

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: [
    'keadex',
    'open source',
    'software architecture',
    'frontend',
    'backend',
    'devops',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_METADATA_BASE!),
  openGraph: {
    title: seo.title,
    description: seo.description,
    images: [
      {
        url: keadexLogo.src,
      },
    ],
  },
}

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function RootLayout({
  children,
  params,
}: PageProps & {
  children: React.ReactNode
}) {
  const { lang } = await params

  return (
    <html lang={lang ?? fallbackLng} dir={dir(lang)}>
      <Script
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="d12031df-a146-4c32-8276-e1d5c086b932"
        data-blockingmode="auto"
        type="text/javascript"
        async
      />
      <body className="bg-primary text-base" data-javak="scs">
        <Layout lang={lang}>{children}</Layout>
      </body>
    </html>
  )
}

export default RootLayout
