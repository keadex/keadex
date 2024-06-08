// Needed due to the following Nextra v2 issues/limitations:
//    - Dynamic routes issue with navbar:
//        - https://github.com/shuding/nextra/discussions/740
//        - https://github.com/shuding/nextra/issues/1976
//    - Missing app router support: https://github.com/shuding/nextra/issues/2023
//
// TODO: remove this workaround when the above issues/limitations have been resolved.

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export type MenuItem = {
  id: string
  title: string
  href?: string
  pattern?: string
  children?: MenuItem[]
  disableTOC?: boolean
  external?: boolean
}

export type NextraSidebarWorkaroundProps = {
  menu: MenuItem[]
  collapsible?: boolean
  hideHierarchyBars?: boolean
}

const chevronDownSvg = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" class="nx-origin-center nx-transition-transform rtl:-nx-rotate-180 ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]"></path></svg>`
const chevronRightSvg = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" class="nx-origin-center nx-transition-transform rtl:-nx-rotate-180"></path></svg>`
const externalSvg = `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="nx-origin-center nx-transition-transform" d="M17.06,9.61v7.67a1.32,1.32,0,0,1-1.32,1.31H1.9A1.31,1.31,0,0,1,.59,17.28v-14A1.31,1.31,0,0,1,1.9,2H9.45"/><polyline points="12.31 0.59 18.59 0.59 18.59 6.73"/><line x1="8.12" y1="10.88" x2="18.59" y2="0.59"/></path></svg>`

export function useNextraSidebarWorkaround(
  props: NextraSidebarWorkaroundProps,
) {
  const { menu } = props

  const [openedMenus, setOpenedMenus] = useState(new Set())

  const router = useRouter()

  function currentPathMatchMenItemPath(
    currentPath: string,
    menuItem: MenuItem,
  ): boolean {
    if (menuItem.pattern || menuItem.href) {
      // menuItem.pattern has an higher priority
      const menuItemPath = menuItem.pattern ?? menuItem.href
      return currentPath.match(menuItemPath!) !== null
    }
    return false
  }

  function urlToOpenedMenus(menu: MenuItem[]): {
    found: boolean
    generatedOpenedMenus: Set<string>
  } {
    const currentPath = location.pathname
    let generatedOpenedMenus = new Set<string>()
    let found = false
    let index = 0
    while (!found && index < menu.length) {
      if (menu[index].children && menu[index].children!.length > 0) {
        const childrenGenOpenedMenus = urlToOpenedMenus(menu[index].children!)
        generatedOpenedMenus = new Set([
          ...generatedOpenedMenus,
          ...childrenGenOpenedMenus.generatedOpenedMenus,
        ])
        found = childrenGenOpenedMenus.found
        if (found) generatedOpenedMenus.add(menu[index].id)
      }
      found = found || currentPathMatchMenItemPath(currentPath, menu[index])
      index++
    }
    if (!found) return { found: false, generatedOpenedMenus: new Set<string>() }
    else return { found: true, generatedOpenedMenus }
  }

  function getDesktopSidebar(): HTMLCollectionOf<Element> {
    return document.getElementsByClassName('nextra-menu-desktop')
  }

  function getMobileSidebar(): HTMLCollectionOf<Element> {
    return document.getElementsByClassName('nextra-menu-mobile')
  }

  function clearDesktopSidebar() {
    const sidebar = getDesktopSidebar()[0]
    while (sidebar.lastChild) {
      sidebar.removeChild(sidebar.lastChild)
    }
  }

  function clearMobileSidebar() {
    const sidebar = getMobileSidebar()[0]
    while (sidebar.lastChild) {
      sidebar.removeChild(sidebar.lastChild)
    }
  }

  function toggleMenu(id: string) {
    if (id) {
      if (openedMenus.has(id)) {
        setOpenedMenus((prev) => {
          prev.delete(id)
          return new Set(prev)
        })
      } else {
        setOpenedMenus((prev) => new Set(prev.add(id)))
      }
    }
  }

  function renderSingleMenuItem(menuItem: MenuItem, root: Element) {
    const isActive = currentPathMatchMenItemPath(location.pathname, menuItem)
    const li = document.createElement('li')
    li.className = `nx-flex nx-flex-col nx-gap-1 ${isActive ? 'active' : ''}`
    const a = document.createElement('a')
    a.href = menuItem.href ?? `#`
    a.className =
      'nx-items-center nx-justify-between nx-gap-2 nx-flex nx-rounded nx-px-2 nx-py-1.5 nx-text-sm nx-transition-colors [word-break:break-word] nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border'
    if (isActive) {
      a.className = `${a.className} nx-bg-primary-100 nx-font-semibold nx-text-primary-800 dark:nx-bg-primary-400/10 dark:nx-text-primary-600 contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500`
    } else {
      a.className = `${a.className} nx-text-gray-500 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:nx-text-neutral-400 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50 contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50 contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50`
    }
    // a.textContent = menuItem.title
    a.innerHTML = `<span>${menuItem.title}</span>${
      menuItem.external ? externalSvg : ``
    }`
    if (menuItem.external) a.target = '_blank'
    li.appendChild(a)
    root.appendChild(li)
  }

  function renderMenuItemWithChildren(menuItem: MenuItem, root: Element) {
    const isOpened = openedMenus.has(menuItem.id)

    // Menu element
    const li = document.createElement('li')
    li.id = menuItem.id
    if (isOpened) li.className = 'open'

    // Clickable menu element
    const a = document.createElement('a')
    a.href = menuItem.href ?? `#`
    if (!menuItem.href) {
      a.onclick = (el) => {
        el.stopPropagation()
        toggleMenu(li.id)
      }
    }
    a.className = `nx-items-center nx-justify-between nx-gap-2 nx-flex nx-rounded nx-px-2 nx-py-1.5 nx-text-sm nx-transition-colors [word-break:break-word] nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border nx-text-gray-500 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:nx-text-neutral-400 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50 contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50 contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50`
    a.innerHTML = `<span>${menuItem.title}</span>${
      isOpened ? chevronDownSvg : chevronRightSvg
    }`
    li.appendChild(a)

    // Root container of the children
    const childrenContainerPanel = document.createElement('div')
    childrenContainerPanel.className =
      'nx-transform-gpu nx-overflow-hidden nx-transition-all nx-ease-in-out motion-reduce:nx-transition-none nx-duration-300'
    if (!isOpened) {
      childrenContainerPanel.className = `${childrenContainerPanel.className} !h-0`
    }

    // Panel of the children
    const childrenPanel = document.createElement('div')
    childrenPanel.className =
      'nx-transition-opacity nx-duration-500 nx-ease-in-out motion-reduce:nx-transition-none nx-opacity-100 ltr:nx-pr-0 rtl:nx-pl-0 nx-pt-1'

    // Children list
    const childrenList = document.createElement('ul')
    childrenList.className = `nx-flex nx-flex-col nx-gap-1 nx-relative before:nx-absolute before:nx-inset-y-1 before:nx-w-px ${
      props.hideHierarchyBars ? '' : 'before:bg-secondary'
    } before:nx-content-[&quot;&quot;] dark:before:nx-bg-neutral-800 ltr:nx-pl-3 ltr:before:nx-left-0 rtl:nx-pr-3 rtl:before:nx-right-0 ltr:nx-ml-3 rtl:nx-mr-3`
    renderMenuElements(menuItem.children!, childrenList)

    childrenPanel.appendChild(childrenList)
    childrenContainerPanel.appendChild(childrenPanel)
    li.appendChild(childrenContainerPanel)

    root.appendChild(li)
  }

  function renderMenuElements(menu: MenuItem[], root: Element) {
    menu.forEach((menuItem) => {
      if (menuItem.children && menuItem.children.length > 0) {
        renderMenuItemWithChildren(menuItem, root)
      } else {
        renderSingleMenuItem(menuItem, root)
      }
    })
  }

  function createSidebar(
    menu: MenuItem[],
    clearSidebar: () => void,
    getSidebar: () => HTMLCollectionOf<Element>,
  ) {
    clearSidebar()
    renderMenuElements(menu, getSidebar()[0])
  }

  useEffect(() => {
    setOpenedMenus(urlToOpenedMenus(menu).generatedOpenedMenus)
  }, [])

  useEffect(() => {
    if (getDesktopSidebar() && getDesktopSidebar().length > 0) {
      createSidebar(menu, clearDesktopSidebar, getDesktopSidebar)
    }
    if (getMobileSidebar() && getMobileSidebar().length > 0) {
      createSidebar(menu, clearMobileSidebar, getMobileSidebar)
    }
  }, [router.asPath, menu])

  return {
    // isSidebarInitialized,
  }
}
