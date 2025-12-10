import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
  faBook,
  faMagnifyingGlass,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons'
import { IconButton, useSafeExit } from '@keadex/keadex-ui-kit/cross'
import type { JSX, SyntheticEvent } from 'react'
import {
  forwardRef,
  PropsWithChildren,
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { twMerge } from 'tailwind-merge'
import { Tooltip } from 'tw-elements'

import { faKeadexMina } from '../../assets/icons'
import AppEventContext, { AppEventType } from '../../context/AppEventContext'
import { openDependencyTable } from '../../core/router/router'
import ROUTES from '../../core/router/routes'
import LibraryPanel from './Panels/LibraryPanel/LibraryPanel'
import ProjectPanel from './Panels/ProjectPanel/ProjectPanel'
import SearchPanel from './Panels/SearchPanel/SearchPanel'

enum MenuItem {
  Project,
  Search,
  Library,
  DependencyTable,
}

export interface AppMenuItem {
  menuItem: MenuItem
  icon: IconProp
  title: string
  onClick?: () => void
}

export type AppMenuCommands = {
  collapse: () => void
}

export interface AppMenuProps {
  visible: boolean
}

export const AppMenu = forwardRef(
  (props: PropsWithChildren<AppMenuProps>, ref: Ref<AppMenuCommands>) => {
    const { visible } = props
    const { t } = useTranslation()
    const context = useContext(AppEventContext)
    const { modal: modalSafeExit, safeExit } = useSafeExit(ROUTES)

    const sidenavSlimWidth = 50
    const [sidenavPanelWidth, setSidenavPanelWidth] = useState(300)
    const [isSlimCollapsed, setIsSlimCollapsed] = useState(false)
    const [activeMenuItem, setActiveMenuItem] = useState(MenuItem.Project)

    const APP_MENU_ITEMS: AppMenuItem[] = [
      {
        menuItem: MenuItem.Project,
        icon: faKeadexMina,
        title: t('common.project'),
      },
      {
        menuItem: MenuItem.Search,
        icon: faMagnifyingGlass,
        title: t('common.search'),
      },
      {
        menuItem: MenuItem.Library,
        icon: faBook,
        title: t('common.library'),
      },
      {
        menuItem: MenuItem.DependencyTable,
        icon: faSitemap,
        title: t('common.dependency_table'),
        onClick: () => {
          openDependencyTable(safeExit, '')
        },
      },
    ]

    const handleSlimTogglerClick = (appMenuItem: AppMenuItem) => {
      if (appMenuItem.onClick) {
        appMenuItem.onClick()
        setIsSlimCollapsed(true)
      } else {
        if (
          appMenuItem.menuItem === activeMenuItem ||
          (isSlimCollapsed && appMenuItem.menuItem !== activeMenuItem)
        ) {
          setIsSlimCollapsed(!isSlimCollapsed)
        }
      }
      setActiveMenuItem(appMenuItem.menuItem)
    }

    const onSidenavPanelResize = (
      e: SyntheticEvent,
      data: ResizeCallbackData,
    ) => {
      setSidenavPanelWidth(data.size.width)
    }

    const isMenuActive = (menuItem: MenuItem) => {
      return activeMenuItem === menuItem && !isSlimCollapsed
    }

    const renderAppMenuItems = () => {
      const renderedItems: JSX.Element[] = []
      APP_MENU_ITEMS.forEach((appMenuItem) => {
        renderedItems.push(
          <li
            key={appMenuItem.menuItem}
            className={twMerge(
              `relative`,
              isMenuActive(appMenuItem.menuItem) ? 'active' : '',
            )}
            onClick={() => handleSlimTogglerClick(appMenuItem)}
            data-te-toggle="tooltip"
            data-te-placement="right"
            title={appMenuItem.title}
          >
            <IconButton
              icon={appMenuItem.icon}
              className={`${
                isMenuActive(appMenuItem.menuItem) ? 'active' : ''
              }`}
              onClick={() => handleSlimTogglerClick(appMenuItem)}
            />
          </li>,
        )
      })
      return renderedItems
    }

    context?.useSubscription((event) => {
      if (event.type === AppEventType.OpenSearch) {
        setActiveMenuItem(MenuItem.Search)
        setIsSlimCollapsed(false)
      }
    })

    useEffect(() => {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-te-toggle="tooltip"]'),
      )
      tooltipTriggerList.map(
        (tooltipTriggerEl) =>
          new Tooltip(tooltipTriggerEl, { trigger: 'hover' }),
      )
    }, [])

    useImperativeHandle(ref, () => ({
      collapse: () => setIsSlimCollapsed(true),
    }))

    return (
      <div
        className={twMerge(
          `h-full`,
          !visible ? 'app-menu__parent--hidden' : '',
        )}
      >
        {modalSafeExit}
        {/* Sidenav */}
        <nav
          id="app-menu-sidenav"
          className={twMerge(
            `absolute h-full`,
            !visible ? 'hidden!' : '',
            `bg-dark-primary group left-0 overflow-hidden shadow-[0_4px_12px_0_rgba(0,0,0,0.07),0_2px_4px_rgba(0,0,0,0.05)]`,
          )}
        >
          <div className="flex h-full flex-row">
            <div
              style={{ width: `${sidenavSlimWidth}px` }}
              className="window__inner-border border-b-0 border-l-0 border-t-0"
            >
              <ul className="relative m-0 list-none text-center text-lg">
                {renderAppMenuItems()}
              </ul>
            </div>
            <Resizable
              height={Infinity}
              width={sidenavPanelWidth}
              onResize={onSidenavPanelResize}
              resizeHandles={['e']}
            >
              <div
                style={{ width: `${sidenavPanelWidth}px`, height: `${100}%` }}
                className={twMerge(
                  `window__inner-border box border-b-0 border-l-0 border-t-0`,
                  isSlimCollapsed ? `hidden` : ``,
                )}
              >
                <div
                  className="h-full"
                  hidden={activeMenuItem !== MenuItem.Project}
                >
                  <ProjectPanel />
                </div>
                <div
                  className="h-full"
                  hidden={activeMenuItem !== MenuItem.Search}
                >
                  <SearchPanel />
                </div>
                <div
                  className="h-full"
                  hidden={activeMenuItem !== MenuItem.Library}
                >
                  <LibraryPanel />
                </div>
              </div>
            </Resizable>
          </div>
        </nav>
        {/* Sidenav */}

        {/* Content */}
        <div
          id="slim-content"
          className={`flex h-full`}
          style={{
            paddingLeft: isSlimCollapsed
              ? `${sidenavSlimWidth}px`
              : `${sidenavPanelWidth + sidenavSlimWidth}px`,
          }}
        >
          <div className="h-full w-full overflow-auto">{props.children}</div>
        </div>
        {/* Content */}
      </div>
    )
  },
)

export default AppMenu
