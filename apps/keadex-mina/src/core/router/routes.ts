import { c4ElementTypePathName } from '@keadex/c4-model-ui-kit'
import { Routes } from '@keadex/keadex-ui-kit/cross'
import titlebarMenuFactory, {
  WindowTitlebarMenuFactoryData,
} from '../../components/Layout/window-titlebar-menu'
import { AppEvent } from '../../context/AppEventContext'

export type MinaRouteData = {
  requiresProject: boolean
}

const ROUTES: Routes<AppEvent, WindowTitlebarMenuFactoryData, MinaRouteData> =
  {}

//---------------- INTERNAL ROUTES

// ----- Home Paths
export const HOME = '/'

ROUTES[HOME] = {
  path: HOME,
  titlebarMenuFactory,
}

// ----- Project Paths
export const HOME_PROJECT = '/project/home'
export const PROJECT_SETTINGS = '/project/settings'

ROUTES[HOME_PROJECT] = {
  path: HOME_PROJECT,
  isAppMenuVisible: true,
  titlebarMenuFactory,
}

ROUTES[PROJECT_SETTINGS] = {
  path: PROJECT_SETTINGS,
  isAppMenuVisible: true,
  protectExit: true,
  titlebarMenuFactory,
}

// ----- Diagrams Paths
export const EDIT_DIAGRAM = '/diagram/edit'

ROUTES[EDIT_DIAGRAM] = {
  path: EDIT_DIAGRAM,
  isAppMenuVisible: true,
  protectExit: true,
  titlebarMenuFactory,
}

// ----- Library Paths
export const BASE_PATH_LIBRARY = '/library/'
export const PERSONS_LIBRARY = `${BASE_PATH_LIBRARY}${c4ElementTypePathName(
  'Person',
)}`
export const SOFTWARE_SYSTEMS_LIBRARY = `${BASE_PATH_LIBRARY}${c4ElementTypePathName(
  'SoftwareSystem',
)}`
export const CONTAINERS_LIBRARY = `${BASE_PATH_LIBRARY}${c4ElementTypePathName(
  'Container',
)}`
export const COMPONENTS_LIBRARY = `${BASE_PATH_LIBRARY}${c4ElementTypePathName(
  'Component',
)}`

ROUTES[PERSONS_LIBRARY] = {
  path: PERSONS_LIBRARY,
  isAppMenuVisible: true,
  titlebarMenuFactory,
}
ROUTES[SOFTWARE_SYSTEMS_LIBRARY] = {
  path: SOFTWARE_SYSTEMS_LIBRARY,
  isAppMenuVisible: true,
  titlebarMenuFactory,
}
ROUTES[CONTAINERS_LIBRARY] = {
  path: CONTAINERS_LIBRARY,
  isAppMenuVisible: true,
  titlebarMenuFactory,
}
ROUTES[COMPONENTS_LIBRARY] = {
  path: COMPONENTS_LIBRARY,
  isAppMenuVisible: true,
  titlebarMenuFactory,
}

// ----- Dependency Table Paths
export const DEPENDENCY_TABLE_ALIAS_URL_PARAM = ':alias?'
export const DEPENDENCY_TABLE = `/dependency-table/${DEPENDENCY_TABLE_ALIAS_URL_PARAM}`
ROUTES[DEPENDENCY_TABLE] = {
  path: DEPENDENCY_TABLE,
  isAppMenuVisible: true,
  isAppMenuCollapsed: true,
  titlebarMenuFactory,
}

//---------------- DEEP LINKS ROUTES
export const DEEP_LINK_SCHEME = 'mina://'
export const OPEN_DIAGRAM_DEEP_LINK = `${DEEP_LINK_SCHEME}open-diagram/`
export const OPEN_DEPENDENCY_TABLE_DEEP_LINK = `${DEEP_LINK_SCHEME}dependency-table/`

ROUTES[OPEN_DIAGRAM_DEEP_LINK] = {
  path: OPEN_DIAGRAM_DEEP_LINK,
  data: {
    requiresProject: true,
  },
}

ROUTES[OPEN_DEPENDENCY_TABLE_DEEP_LINK] = {
  path: OPEN_DEPENDENCY_TABLE_DEEP_LINK,
  data: {
    requiresProject: true,
  },
}

export default ROUTES
