// Needed due to the following Nextra v2 issues/limitations:
//    - Dynamic routes issue with navbar:
//        - https://github.com/shuding/nextra/discussions/740
//        - https://github.com/shuding/nextra/issues/1976
//    - Missing app router support: https://github.com/shuding/nextra/issues/2023
//
// TODO: remove this workaround when the above issues/limitations have been resolved.

import { useRouter } from 'next/router'
import { useEffect } from 'react'

export type MenuItem = {
  title: string
  href: string
  children?: MenuItem[]
}

export type NextraSidebarWorkaroundProps = {
  menu: MenuItem[]
}

export function useNextraSidebarWorkaround(
  props: NextraSidebarWorkaroundProps,
) {
  const { menu } = props

  const router = useRouter()

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

  function createSidebar(
    menu: MenuItem[],
    clearSidebar: () => void,
    getSidebar: () => HTMLCollectionOf<Element>,
  ) {
    clearSidebar()
    menu.forEach((menuItem) => {
      const isActive = menuItem.href === location.pathname
      const li = document.createElement('li')
      li.className = `nx-flex nx-flex-col nx-gap-1 ${isActive ? 'active' : ''}`
      const a = document.createElement('a')
      a.href = menuItem.href
      a.className =
        'nx-flex nx-rounded nx-px-2 nx-py-1.5 nx-text-sm nx-transition-colors [word-break:break-word] nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border'
      if (isActive) {
        a.className = `${a.className} nx-bg-primary-100 nx-font-semibold nx-text-primary-800 dark:nx-bg-primary-400/10 dark:nx-text-primary-600 contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500`
      } else {
        a.className = `${a.className} nx-text-gray-500 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:nx-text-neutral-400 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50 contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50 contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50`
      }
      a.textContent = menuItem.title
      li.appendChild(a)
      getSidebar()[0].appendChild(li)
    })
  }

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
