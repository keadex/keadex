import { PageMapOverrides } from '../helper/nextra-helper'
import ROUTES, {
  C4_MODEL_UI_KIT_API,
  C4_MODEL_UI_KIT_ARCH,
  C4_MODEL_UI_KIT_DOCS,
  DOCS_OVERVIEW,
  MINA_AI,
  MINA_ARCH_MODULES,
  MINA_ARCH_OVERVIEW,
  MINA_ARCHITECTURE,
  MINA_CLI_COMMANDS,
  MINA_CLI_OVERVIEW,
  MINA_CONFLUENCE_PLUGIN,
  MINA_DOCS,
  MINA_FEATURES,
  MINA_GETTING_STARTED,
  MINA_GS_PROJECT_STRUCTURE,
  MINA_GS_QUICK_START,
  MINA_HOOKS,
  MINA_INTRODUCTION,
  MINA_PLANTUML,
  MINA_PLUGINS,
  MINA_PLUGINS_OVERVIEW,
  MINA_RENDERING_SYSTEM,
  MINA_SHARE_DIAGRAMS,
  MINA_SSR,
} from './routes'

export const PAGE_MAP_OVERRIDES: PageMapOverrides = new Map([
  //############# Overview
  [`/en${ROUTES[DOCS_OVERVIEW].path}`, { position: 1 }],

  //############# Keadex Mina Docs
  [`${ROUTES[MINA_DOCS].path}`, { title: 'Keadex Mina', position: 2 }],
  [`${ROUTES[MINA_INTRODUCTION].path}`, { position: 1 }],

  //--- Getting Started
  [`${ROUTES[MINA_GETTING_STARTED].path}`, { position: 2 }],
  [`${ROUTES[MINA_GS_QUICK_START].path}`, { position: 1 }],
  [`${ROUTES[MINA_GS_PROJECT_STRUCTURE].path}`, { position: 2 }],

  //--- Features
  [`${ROUTES[MINA_FEATURES].path}`, { position: 3 }],
  [`${ROUTES[MINA_AI].path}`, { title: 'AI' }],
  [`${ROUTES[MINA_CLI_OVERVIEW].path}`, { title: 'Overview', position: 1 }],
  [`${ROUTES[MINA_CLI_COMMANDS].path}`, { title: 'Commands', position: 2 }],
  [`${ROUTES[MINA_HOOKS].path}`, { title: 'Hooks' }],
  [`${ROUTES[MINA_PLANTUML].path}`, { title: 'PlantUML' }],
  [`${ROUTES[MINA_SSR].path}`, { title: 'Server Side Rendering' }],
  [`${ROUTES[MINA_SHARE_DIAGRAMS].path}`, { title: 'Share Diagrams' }],

  //--- Architecture
  [`${ROUTES[MINA_ARCHITECTURE].path}`, { position: 4 }],
  [`${ROUTES[MINA_ARCH_OVERVIEW].path}`, { position: 1 }],
  [`${ROUTES[MINA_ARCH_MODULES].path}`, { position: 2 }],
  [`${ROUTES[MINA_RENDERING_SYSTEM].path}`, { position: 3 }],

  //--- Plugins
  [
    `${ROUTES[MINA_PLUGINS].path}`,
    { title: 'Plugins & Components', position: 5 },
  ],
  [`${ROUTES[MINA_PLUGINS_OVERVIEW].path}`, { position: 1 }],
  [
    `${ROUTES[MINA_CONFLUENCE_PLUGIN].path}`,
    { title: 'Confluence Plugin', position: 2 },
  ],

  //############# C4 Model UI Kit Docs
  [`${ROUTES[C4_MODEL_UI_KIT_DOCS].path}`, { position: 3 }],
  [`${ROUTES[C4_MODEL_UI_KIT_ARCH].path}`, { position: 1 }],
  [`${ROUTES[C4_MODEL_UI_KIT_API].path}`, { position: 2 }],
])
