import { useAppBootstrap } from '@keadex/keadex-ui-kit/cross'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import ROUTES, {
  C4_MODEL_UI_KIT_API,
  C4_MODEL_UI_KIT_API_PATTERN,
  C4_MODEL_UI_KIT_ARCH,
  DOCS_OVERVIEW,
  MINA_AI,
  MINA_ARCH_MODULES,
  MINA_ARCH_OVERVIEW,
  MINA_AUTOLAYOUT,
  MINA_CONFLUENCE_PLUGIN,
  MINA_LINKS,
  MINA_DIAGRAMS_ORG,
  MINA_EXPORT,
  MINA_GS_PROJECT_STRUCTURE,
  MINA_GS_QUICK_START,
  MINA_HOOKS,
  MINA_INTELLISENSE,
  MINA_INTRODUCTION,
  MINA_LIBRARY,
  MINA_LOW_CODING,
  MINA_PLANTUML,
  MINA_PLUGINS_OVERVIEW,
  MINA_RENDERING_SYSTEM,
  MINA_SEARCH,
  MINA_TAGS,
  MINA_THEMES,
  MINA_VERSIONING,
  MINA_DEEP_LINKS,
  MINA_DEPENDENCY_TABLE,
  MINA_CLI_OVERVIEW,
  MINA_CLI_COMMANDS,
  MINA_CONTINUOUS_INTEGRATION,
  MINA_SHARE_DIAGRAMS,
  MINA_SSR,
} from '../core/routes'
import {
  MenuItem,
  useNextraSidebarWorkaround,
} from '../hooks/useNextraSidebarWorkaround/useNextraSidebarWorkaround'
import { NewsBanner } from '@keadex/keadex-ui-kit/cross'
import { NEWS } from '../core/news'
import '../styles/index.css'
import '../styles/nextra.css'
import { initConsole } from '@keadex/keadex-utils'

initConsole()

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | undefined>()

  const sidebar: MenuItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      href: `/en${ROUTES[DOCS_OVERVIEW].path}`,
      disableTOC: true,
    },
    {
      id: 'keadex-mina',
      title: 'Keadex Mina',
      children: [
        {
          id: 'keadex-mina_introduction',
          title: 'Introduction',
          href: ROUTES[MINA_INTRODUCTION].path,
          disableTOC: true,
        },
        {
          id: 'keadex-mina_getting-started',
          title: 'Getting Started',
          children: [
            {
              id: 'keadex-mina_quick-start',
              title: 'Quick Start',
              href: ROUTES[MINA_GS_QUICK_START].path,
            },
            {
              id: 'keadex-mina_project-structure',
              title: 'Project Structure',
              href: ROUTES[MINA_GS_PROJECT_STRUCTURE].path,
            },
          ],
        },
        {
          id: 'keadex-mina_features',
          title: 'Features',
          children: [
            {
              id: 'keadex-mina_ai',
              title: 'AI',
              href: ROUTES[MINA_AI].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_autolayout',
              title: 'Auto Layout',
              href: ROUTES[MINA_AUTOLAYOUT].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_cli',
              title: 'CLI',
              children: [
                {
                  id: 'keadex-mina_cli_overview',
                  title: 'Overview',
                  href: ROUTES[MINA_CLI_OVERVIEW].path,
                  disableTOC: true,
                },
                {
                  id: 'keadex-mina_cli_commands',
                  title: 'Commands',
                  href: ROUTES[MINA_CLI_COMMANDS].path,
                },
              ],
            },
            {
              id: 'keadex-mina_continuous-integration',
              title: 'Continuous Integration',
              href: ROUTES[MINA_CONTINUOUS_INTEGRATION].path,
            },
            {
              id: 'keadex-mina_deep-links',
              title: 'Deep Links',
              href: ROUTES[MINA_DEEP_LINKS].path,
              disableTOC: false,
            },
            {
              id: 'keadex-mina_dependency-table',
              title: 'Dependency Table',
              href: ROUTES[MINA_DEPENDENCY_TABLE].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_diagrams-org',
              title: 'Diagrams Organization',
              href: ROUTES[MINA_DIAGRAMS_ORG].path,
            },
            {
              id: 'keadex-mina_export',
              title: 'Export',
              href: ROUTES[MINA_EXPORT].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_hooks',
              title: 'Hooks',
              href: ROUTES[MINA_HOOKS].path,
            },
            {
              id: 'keadex-mina_intellisense',
              title: 'IntelliSense',
              href: ROUTES[MINA_INTELLISENSE].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_library',
              title: 'Library',
              href: ROUTES[MINA_LIBRARY].path,
            },
            {
              id: 'keadex-mina_links',
              title: 'Links',
              href: ROUTES[MINA_LINKS].path,
            },
            {
              id: 'keadex-mina_low-coding',
              title: 'Low-Coding',
              href: ROUTES[MINA_LOW_CODING].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_plantuml',
              title: 'PlantUML',
              href: ROUTES[MINA_PLANTUML].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_search',
              title: 'Search',
              href: ROUTES[MINA_SEARCH].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_ssr',
              title: 'Server Side Rendering',
              href: ROUTES[MINA_SSR].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_share-diagrams',
              title: 'Share Diagrams',
              href: ROUTES[MINA_SHARE_DIAGRAMS].path,
              disableTOC: false,
            },
            {
              id: 'keadex-mina_tags',
              title: 'Tags',
              href: ROUTES[MINA_TAGS].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_themes',
              title: 'Themes',
              href: ROUTES[MINA_THEMES].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_versioning',
              title: 'Versioning',
              href: ROUTES[MINA_VERSIONING].path,
              disableTOC: true,
            },
          ],
        },
        {
          id: 'keadex-mina_architecture',
          title: 'Architecture',
          children: [
            {
              id: 'keadex-mina_arch-overview',
              title: 'Overview',
              href: ROUTES[MINA_ARCH_OVERVIEW].path,
            },
            {
              id: 'keadex-mina_arch-modules',
              title: 'Modules',
              href: ROUTES[MINA_ARCH_MODULES].path,
            },
            {
              id: 'keadex-mina_rendering-system',
              title: 'Rendering System',
              href: ROUTES[MINA_RENDERING_SYSTEM].path,
              disableTOC: true,
            },
          ],
        },
        {
          id: 'keadex-mina_plugins',
          title: 'Plugins & Components',
          children: [
            {
              id: 'keadex-mina_plugin-overview',
              title: 'Overview',
              href: ROUTES[MINA_PLUGINS_OVERVIEW].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_confluence-plugin',
              title: 'Confluence Plugin',
              href: ROUTES[MINA_CONFLUENCE_PLUGIN].path,
              disableTOC: true,
            },
            {
              id: 'keadex-mina_docusaurus-plugin',
              title: 'Docusaurus Plugin',
              href: 'https://www.npmjs.com/package/@keadex/docusaurus-plugin-mina',
              external: true,
            },
            {
              id: 'keadex-mina_live-component',
              title: 'Mina Live',
              href: 'https://www.npmjs.com/package/@keadex/mina-live',
              external: true,
            },
            {
              id: 'keadex-mina_react-component',
              title: 'Mina React',
              href: 'https://www.npmjs.com/package/@keadex/mina-react',
              external: true,
            },
          ],
        },
      ],
    },
    {
      id: 'c4-model-ui-kit',
      title: 'C4 Model UI Kit',
      children: [
        {
          id: 'c4-model-ui-kit_architecture',
          title: 'Architecture',
          href: ROUTES[C4_MODEL_UI_KIT_ARCH].path,
          disableTOC: true,
        },
        {
          id: 'c4-model-ui-kit_api',
          title: 'API',
          href: ROUTES[C4_MODEL_UI_KIT_API].path,
          pattern: C4_MODEL_UI_KIT_API_PATTERN,
        },
      ],
    },
  ]

  useAppBootstrap({ initGA: true })
  useNextraSidebarWorkaround({ menu: sidebar })

  function getSelectedMenuItem(sidebar: MenuItem[]): MenuItem | undefined {
    for (const menuItem of sidebar) {
      if (menuItem.href === location.pathname) {
        return menuItem
      } else if (menuItem.children) {
        const item = getSelectedMenuItem(menuItem.children)
        if (item) return item
      }
    }
    return
  }

  useEffect(() => {
    setSelectedMenu(getSelectedMenuItem(sidebar))
  }, [])

  return (
    <div
      className={`bg-primary text-base nextra-container ${
        selectedMenu && selectedMenu.disableTOC ? 'toc-disabled' : ''
      }`}
    >
      <NewsBanner content={NEWS} />
      <Component {...pageProps} />
    </div>
  )
}
