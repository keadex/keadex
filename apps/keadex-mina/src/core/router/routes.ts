import { Routes } from '@keadex/keadex-ui-kit/cross'
import titlebarMenuFactory, {
  WindowTitlebarMenuFactoryData,
} from '../../components/Layout/window-titlebar-menu'
import { c4ElementTypePathName } from '@keadex/c4-model-ui-kit'
import { AppEvent } from '../../context/AppEventContext'

const ROUTES: Routes<AppEvent, WindowTitlebarMenuFactoryData> = {}

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

// ----- Library paths
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

export default ROUTES
