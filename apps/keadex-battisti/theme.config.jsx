import Image from 'next/image'
import keadexLogo from './public/img/keadex-docs-logo.svg'
import Footer from './src/components/Footer/Footer'

const config = {
  docsRepositoryBase:
    'https://github.com/keadex/keadex/tree/main/apps/keadex-battisti',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Keadex',
    }
  },
  darkMode: false,
  nextThemes: {
    defaultTheme: 'dark',
  },
  logo: (
    <div className="flex flex-row">
      <a href="/">
        <Image height={24} src={keadexLogo} alt="Keadex Logo" />
      </a>
      <a href="/">Back to Keadex</a>
      {/* <a href="/en/docs/mina">Keadex Mina</a> */}
    </div>
  ),
  logoLink: false,
  footer: {
    component: Footer,
  },
  // ... other theme options
}

export default config
