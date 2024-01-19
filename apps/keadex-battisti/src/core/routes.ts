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

ROUTES[DOCS] = {
  path: DOCS,
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
