import { findRoute, useSafeExit } from '@keadex/keadex-ui-kit/cross'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import type { NavigateOptions } from 'react-router-dom'
import { createMemoryRouter, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Layout from '../../components/Layout/Layout'
import AppEventContext, {
  AppEvent,
  AppEventType,
} from '../../context/AppEventContext'
import DependencyTable from '../../views/DependencyTable/DependencyTable'
import DiagramEditor, {
  DiagramEditorState,
} from '../../views/DiagramEditor/DiagramEditor'
import Home from '../../views/Home/Home'
import HomeProject from '../../views/HomeProject/HomeProject'
import LibraryElement from '../../views/LibraryElement/LibraryElement'
import ProjectSettings from '../../views/ProjectSettings/ProjectSettings'
import store from '../store/store'
import {
  diagramNameTypeFromLinkString,
  diagramNameTypeFromPath,
} from '../tauri-rust-bridge'
import ROUTES, {
  COMPONENTS_LIBRARY,
  CONTAINERS_LIBRARY,
  DEPENDENCY_TABLE,
  DEPENDENCY_TABLE_ALIAS_URL_PARAM,
  EDIT_DIAGRAM,
  EXTERNAL_DIAGRAMS,
  EXTERNAL_DIAGRAMS_DIAGRAM_URL_PARAM,
  HOME,
  HOME_PROJECT,
  OPEN_DEPENDENCY_TABLE_DEEP_LINK,
  OPEN_DIAGRAM_DEEP_LINK,
  OPEN_EXTERNAL_DIAGRAM_DEEP_LINK,
  PERSONS_LIBRARY,
  PROJECT_SETTINGS,
  SOFTWARE_SYSTEMS_LIBRARY,
} from './routes'
import ExternalDiagrams from '../../views/ExternalDiagrams/ExternalDiagrams'

export const router = createMemoryRouter([
  {
    element: <Layout />,
    children: [
      {
        path: ROUTES[HOME].path,
        element: <Home />,
      },
      {
        path: ROUTES[HOME_PROJECT].path,
        element: <HomeProject />,
      },
      {
        path: ROUTES[PROJECT_SETTINGS].path,
        element: <ProjectSettings mode="edit" />,
      },
      {
        path: ROUTES[EDIT_DIAGRAM].path,
        element: <DiagramEditor />,
      },
      {
        path: ROUTES[PERSONS_LIBRARY].path,
        element: <LibraryElement c4ElementType="Person" />,
      },
      {
        path: ROUTES[SOFTWARE_SYSTEMS_LIBRARY].path,
        element: <LibraryElement c4ElementType="SoftwareSystem" />,
      },
      {
        path: ROUTES[CONTAINERS_LIBRARY].path,
        element: <LibraryElement c4ElementType="Container" />,
      },
      {
        path: ROUTES[COMPONENTS_LIBRARY].path,
        element: <LibraryElement c4ElementType="Component" />,
      },
      {
        path: ROUTES[DEPENDENCY_TABLE].path,
        element: <DependencyTable />,
      },
      {
        path: ROUTES[EXTERNAL_DIAGRAMS].path,
        element: <ExternalDiagrams />,
      },
    ],
  },
])

export function useDeepLinkRouter() {
  const { t } = useTranslation()
  const { modal: modalSafeExit, safeExit } = useSafeExit(ROUTES)
  const context = useContext(AppEventContext)
  const location = useLocation()

  async function routeDeepLink(deepLink: string) {
    const foundRoute = findRoute(
      deepLink,
      ROUTES,
      (pathname: string, pattern: string) => {
        return pathname.startsWith(pattern)
      },
    )
    if (foundRoute) {
      if (
        foundRoute.data?.requiresProject &&
        store.getState().project.value === undefined
      ) {
        toast.error(t('deep_link.required_open_project', { deepLink }))
      } else {
        const deepLinkParams = deepLink.replace(foundRoute.path, '')
        switch (foundRoute.path) {
          case OPEN_DIAGRAM_DEEP_LINK:
            try {
              await openDiagram(
                deepLinkParams,
                'link',
                location.pathname,
                context,
                safeExit,
              )
            } catch (e) {
              toast.error(t('deep_link.invalid_diagram_path', { deepLink }))
            }
            break
          case OPEN_DEPENDENCY_TABLE_DEEP_LINK:
            {
              const depGraphParams = deepLinkParams.split('/')
              if (
                depGraphParams.length !== 1 ||
                (depGraphParams.length === 1 &&
                  depGraphParams[0].replace(/ /gi, '').length === 0)
              ) {
                toast.error(
                  t('deep_link.invalid_dependency_table_path', { deepLink }),
                )
              } else {
                openDependencyTable(safeExit, depGraphParams[0])
              }
            }
            break
          case OPEN_EXTERNAL_DIAGRAM_DEEP_LINK:
            {
              const externalDiagramParams = deepLinkParams.split('/')
              if (
                externalDiagramParams.length !== 1 ||
                (externalDiagramParams.length === 1 &&
                  externalDiagramParams[0].replace(/ /gi, '').length === 0)
              ) {
                toast.error(
                  t('deep_link.invalid_external_diagram_path', { deepLink }),
                )
              } else {
                openExternalDiagram(safeExit, externalDiagramParams[0])
              }
            }
            break
          default:
            toast.error(t('deep_link.unsupported_deep_link'))
        }
      }
    } else {
      toast.error(t('deep_link.unsupported_deep_link'))
    }
  }
  return {
    routeDeepLink,
    modalSafeExit,
  }
}

export async function openDiagram(
  newDiagramUri: string,
  diagramUriType: 'fs_path' | 'link',
  currentLocationPath: string,
  context: EventEmitter<AppEvent> | null,
  safeExit: (
    destination: string,
    navigateOptions?: NavigateOptions | undefined,
  ) => void,
) {
  const diagram =
    diagramUriType === 'fs_path'
      ? await diagramNameTypeFromPath(newDiagramUri)
      : await diagramNameTypeFromLinkString(newDiagramUri)
  if (diagram && diagram.diagram_name && diagram.diagram_type) {
    const state: DiagramEditorState = {
      diagramName: diagram.diagram_name,
      diagramType: diagram.diagram_type,
    }
    if (currentLocationPath === EDIT_DIAGRAM) {
      context?.emit({ type: AppEventType.OpenDiagram, data: { state } })
    } else {
      safeExit(EDIT_DIAGRAM, {
        state,
      })
    }
  }
}

export function openDependencyTable(
  safeExit: (
    destination: string,
    navigateOptions?: NavigateOptions | undefined,
  ) => void,
  alias?: string,
) {
  safeExit(
    DEPENDENCY_TABLE.replace(DEPENDENCY_TABLE_ALIAS_URL_PARAM, alias ?? ''),
  )
}

export function openExternalDiagram(
  safeExit: (
    destination: string,
    navigateOptions?: NavigateOptions | undefined,
  ) => void,
  diagram?: string,
) {
  safeExit(
    EXTERNAL_DIAGRAMS.replace(
      EXTERNAL_DIAGRAMS_DIAGRAM_URL_PARAM,
      diagram ?? '',
    ),
  )
}
