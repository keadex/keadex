import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faBook, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from '@keadex/keadex-ui-kit/cross'
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Resizable, ResizeCallbackData } from 'react-resizable'
import { Tooltip } from 'tw-elements'
import { faKeadexMina } from '../../assets/icons'
import LibraryPanel from './Panels/LibraryPanel/LibraryPanel'
import ProjectPanel from './Panels/ProjectPanel/ProjectPanel'
import SearchPanel from './Panels/SearchPanel/SearchPanel'
import AppEventContext, { AppEventType } from '../../context/AppEventContext'

enum MenuItem {
  Project,
  Search,
  Library,
}

export interface AppMenuItem {
  menuItem: MenuItem
  icon: IconProp
  title: string
}

export interface AppMenuProps {
  visible: boolean
}

export const AppMenu = React.memo((props: PropsWithChildren<AppMenuProps>) => {
  const { visible } = props
  const { t } = useTranslation()
  const context = useContext(AppEventContext)

  const sidenavSlimWidth = 50
  const [sidenavPanelWidth, setSidenavPanelWidth] = useState(300)
  const [isSlimCollapsed, setIsSlimCollapsed] = useState(true)
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
  ]

  const handleSlimTogglerClick = (menuItem: MenuItem) => {
    if (
      menuItem === activeMenuItem ||
      (isSlimCollapsed && menuItem !== activeMenuItem)
    ) {
      setIsSlimCollapsed(!isSlimCollapsed)
    }
    setActiveMenuItem(menuItem)
  }

  const onSidenavPanelResize = (
    e: React.SyntheticEvent,
    data: ResizeCallbackData
  ) => {
    setSidenavPanelWidth(data.size.width)
  }

  const isMenuActive = (menuItem: MenuItem) => {
    return activeMenuItem === menuItem && !isSlimCollapsed
  }

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-te-toggle="tooltip"]')
    )
    tooltipTriggerList.map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl, { trigger: 'hover' })
    )
  }, [])

  const renderAppMenuItems = () => {
    const renderedItems: JSX.Element[] = []
    APP_MENU_ITEMS.forEach((appMenuItem) => {
      renderedItems.push(
        <li
          key={appMenuItem.menuItem}
          className={`relative ${
            isMenuActive(appMenuItem.menuItem) ? 'active' : ''
          }`}
          onClick={() => handleSlimTogglerClick(appMenuItem.menuItem)}
          data-te-toggle="tooltip"
          data-te-placement="right"
          title={appMenuItem.title}
        >
          <IconButton
            icon={appMenuItem.icon}
            className={`${isMenuActive(appMenuItem.menuItem) ? 'active' : ''}`}
            onClick={() => handleSlimTogglerClick(appMenuItem.menuItem)}
          />
        </li>
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

  return (
    <div className={`h-full ${!visible ? 'app-menu__parent--hidden' : ''}`}>
      {/* Sidenav */}
      <nav
        id="app-menu-sidenav"
        className={`absolute h-full ${
          !visible ? '!hidden' : ''
        }  bg-dark-primary group fixed left-0 overflow-hidden shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)]`}
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
              className={`window__inner-border box border-b-0 border-l-0 border-t-0 ${
                isSlimCollapsed ? `hidden` : ``
              }`}
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
})

export default AppMenu
