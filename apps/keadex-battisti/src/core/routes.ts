import { Routes } from '@keadex/keadex-ui-kit/cross'

const ROUTES: Routes<void, void> = {}

// ----- Home Paths
export const HOME = '/'

ROUTES[HOME] = {
  path: HOME,
}

// ----- About Me Paths
export const ABOUT_ME = '/about-me'

ROUTES[ABOUT_ME] = {
  path: ABOUT_ME,
}

// ----- Projects Paths
export const PROJECTS = '/projects'
export const PROJECT_KEADEX_MINA = '/projects/keadex-mina'
export const PROJECT_KEADEX_BATTISTI = '/projects/keadex-battisti'
export const PROJECT_KEADEX_DOCS = '/projects/keadex-docs'
export const PROJECT_C4MODEL_UI_KIT = '/projects/c4model-ui-kit'
export const PROJECT_KEADEX_UI_KIT = '/projects/keadex-ui-kit'

export const PROJECTS_ROUTES = [
  { name: 'Keadex Mina', path: PROJECT_KEADEX_MINA },
]

ROUTES[PROJECTS] = {
  path: PROJECTS,
}
ROUTES[PROJECT_KEADEX_MINA] = {
  path: PROJECT_KEADEX_MINA,
}
ROUTES[PROJECT_KEADEX_BATTISTI] = {
  path: PROJECT_KEADEX_BATTISTI,
}
ROUTES[PROJECT_KEADEX_DOCS] = {
  path: PROJECT_KEADEX_DOCS,
}
ROUTES[PROJECT_C4MODEL_UI_KIT] = {
  path: PROJECT_C4MODEL_UI_KIT,
}
ROUTES[PROJECT_KEADEX_UI_KIT] = {
  path: PROJECT_KEADEX_UI_KIT,
}

// ----- Documentation Paths
export const DOCS = '/docs'
export const DOCS_OVERVIEW = '/docs/overview'

// > Keadex Mina
export const MINA_DOCS = `/en${DOCS}/mina`
// --> Mina Introduction
export const MINA_INTRODUCTION = `${MINA_DOCS}/introduction`
// --> Mina Architecture
export const MINA_ARCHITECTURE = `${MINA_DOCS}/architecture`
export const MINA_ARCH_OVERVIEW = `${MINA_ARCHITECTURE}/overview`
export const MINA_ARCH_MODULES = `${MINA_ARCHITECTURE}/modules`
export const MINA_RENDERING_SYSTEM = `${MINA_ARCHITECTURE}/rendering-system`
// --> Mina Getting Started
export const MINA_GETTING_STARTED = `${MINA_DOCS}/getting-started`
export const MINA_GS_QUICK_START = `${MINA_GETTING_STARTED}/quick-start`
export const MINA_GS_PROJECT_STRUCTURE = `${MINA_GETTING_STARTED}/project-structure`
// --> Mina Features
export const MINA_FEATURES = `${MINA_DOCS}/features`
export const MINA_AI = `${MINA_FEATURES}/ai`
export const MINA_AUTOLAYOUT = `${MINA_FEATURES}/autolayout`
export const MINA_CONTINUOUS_INTEGRATION = `${MINA_FEATURES}/continuous-integration`
export const MINA_DEPENDENCY_TABLE = `${MINA_FEATURES}/dependency-table`
export const MINA_DEEP_LINKS = `${MINA_FEATURES}/deep-links`
export const MINA_DIAGRAMS_ORG = `${MINA_FEATURES}/diagrams-organization`
export const MINA_EXPORT = `${MINA_FEATURES}/export`
export const MINA_HOOKS = `${MINA_FEATURES}/hooks`
export const MINA_INTELLISENSE = `${MINA_FEATURES}/intellisense`
export const MINA_LIBRARY = `${MINA_FEATURES}/library`
export const MINA_LINKS = `${MINA_FEATURES}/links`
export const MINA_LOW_CODING = `${MINA_FEATURES}/low-coding`
export const MINA_PLANTUML = `${MINA_FEATURES}/plantuml`
export const MINA_SEARCH = `${MINA_FEATURES}/search`
export const MINA_TAGS = `${MINA_FEATURES}/tags`
export const MINA_THEMES = `${MINA_FEATURES}/themes`
export const MINA_VERSIONING = `${MINA_FEATURES}/versioning`
// ----> Mina Features: CLI
export const MINA_CLI = `${MINA_FEATURES}/cli`
export const MINA_CLI_OVERVIEW = `${MINA_CLI}/overview`
export const MINA_CLI_COMMANDS = `${MINA_CLI}/commands`
// --> Mina Plugins
export const MINA_PLUGINS = `${MINA_DOCS}/plugins`
export const MINA_PLUGINS_OVERVIEW = `${MINA_PLUGINS}/overview`
export const MINA_CONFLUENCE_PLUGIN = `${MINA_PLUGINS}/confluence`

// > C4 Model UI Kit
export const C4_MODEL_UI_KIT_DOCS = `/en${DOCS}/c4-model-ui-kit`
export const C4_MODEL_UI_KIT_ARCH = `${C4_MODEL_UI_KIT_DOCS}/architecture`
export const C4_MODEL_UI_KIT_API_PATTERN = `${C4_MODEL_UI_KIT_DOCS}/api/*`
export const C4_MODEL_UI_KIT_API = `${C4_MODEL_UI_KIT_DOCS}/api/api`

ROUTES[DOCS] = {
  path: DOCS,
}
ROUTES[DOCS_OVERVIEW] = {
  path: DOCS_OVERVIEW,
}
ROUTES[MINA_DOCS] = {
  path: MINA_DOCS,
}
ROUTES[MINA_INTRODUCTION] = {
  path: MINA_INTRODUCTION,
}
ROUTES[MINA_ARCHITECTURE] = {
  path: MINA_ARCHITECTURE,
}
ROUTES[MINA_ARCH_OVERVIEW] = {
  path: MINA_ARCH_OVERVIEW,
}
ROUTES[MINA_ARCH_MODULES] = {
  path: MINA_ARCH_MODULES,
}
ROUTES[MINA_RENDERING_SYSTEM] = {
  path: MINA_RENDERING_SYSTEM,
}
ROUTES[MINA_GETTING_STARTED] = {
  path: MINA_GETTING_STARTED,
}
ROUTES[MINA_GS_QUICK_START] = {
  path: MINA_GS_QUICK_START,
}
ROUTES[MINA_GS_PROJECT_STRUCTURE] = {
  path: MINA_GS_PROJECT_STRUCTURE,
}
ROUTES[MINA_FEATURES] = {
  path: MINA_FEATURES,
}
ROUTES[MINA_AI] = {
  path: MINA_AI,
}
ROUTES[MINA_AUTOLAYOUT] = {
  path: MINA_AUTOLAYOUT,
}
ROUTES[MINA_CLI_OVERVIEW] = {
  path: MINA_CLI_OVERVIEW,
}
ROUTES[MINA_CLI_COMMANDS] = {
  path: MINA_CLI_COMMANDS,
}
ROUTES[MINA_CONTINUOUS_INTEGRATION] = {
  path: MINA_CONTINUOUS_INTEGRATION,
}
ROUTES[MINA_DEEP_LINKS] = {
  path: MINA_DEEP_LINKS,
}
ROUTES[MINA_DEPENDENCY_TABLE] = {
  path: MINA_DEPENDENCY_TABLE,
}
ROUTES[MINA_DIAGRAMS_ORG] = {
  path: MINA_DIAGRAMS_ORG,
}
ROUTES[MINA_EXPORT] = {
  path: MINA_EXPORT,
}
ROUTES[MINA_HOOKS] = {
  path: MINA_HOOKS,
}
ROUTES[MINA_INTELLISENSE] = {
  path: MINA_INTELLISENSE,
}
ROUTES[MINA_LIBRARY] = {
  path: MINA_LIBRARY,
}
ROUTES[MINA_LINKS] = {
  path: MINA_LINKS,
}
ROUTES[MINA_LOW_CODING] = {
  path: MINA_LOW_CODING,
}
ROUTES[MINA_PLANTUML] = {
  path: MINA_PLANTUML,
}
ROUTES[MINA_SEARCH] = {
  path: MINA_SEARCH,
}
ROUTES[MINA_TAGS] = {
  path: MINA_TAGS,
}
ROUTES[MINA_THEMES] = {
  path: MINA_THEMES,
}
ROUTES[MINA_VERSIONING] = {
  path: MINA_VERSIONING,
}
ROUTES[MINA_PLUGINS] = {
  path: MINA_PLUGINS,
}
ROUTES[MINA_PLUGINS_OVERVIEW] = {
  path: MINA_PLUGINS_OVERVIEW,
}
ROUTES[MINA_CONFLUENCE_PLUGIN] = {
  path: MINA_CONFLUENCE_PLUGIN,
}
ROUTES[C4_MODEL_UI_KIT_DOCS] = {
  path: C4_MODEL_UI_KIT_DOCS,
}
ROUTES[C4_MODEL_UI_KIT_ARCH] = {
  path: C4_MODEL_UI_KIT_ARCH,
}
ROUTES[C4_MODEL_UI_KIT_API] = {
  path: C4_MODEL_UI_KIT_API,
}

// ----- Policies Paths
export const COOKIE_DECLARATION = '/cookie-declaration'
export const PRIVACY_POLICY = '/privacy-policy'
export const TERMS_AND_CONDITIONS = '/terms-conditions'

ROUTES[COOKIE_DECLARATION] = {
  path: COOKIE_DECLARATION,
}
ROUTES[PRIVACY_POLICY] = {
  path: PRIVACY_POLICY,
}
ROUTES[TERMS_AND_CONDITIONS] = {
  path: TERMS_AND_CONDITIONS,
}

export default ROUTES
