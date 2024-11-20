import { matchPath } from 'react-router-dom'
import { WindowTitlebarMenuFactory } from '../desktop'

export interface Routes<T, K, D = undefined> {
  [path: string]: Route<T, K, D>
}

export interface Route<T, K, D = undefined> {
  path: string
  titlebarMenuFactory?: WindowTitlebarMenuFactory<T, K>
  isAppMenuVisible?: boolean
  isAppMenuCollapsed?: boolean
  isNewsbarVisible?: boolean
  isHeaderVisible?: boolean
  isFooterVisible?: boolean
  protectExit?: boolean
  data?: D
}

export function findRoute<T, K, D = undefined>(
  pathname: string,
  routes: Routes<T, K, D>,
  customPredicate?: (pathname: string, pattern: string) => boolean,
): Route<T, K, D> | undefined {
  const defaultPredicate = (pathname: string, pattern: string) => {
    return matchPath(pattern, pathname) !== null
  }
  for (const pattern of Object.keys(routes)) {
    const predicate = customPredicate ?? defaultPredicate
    if (predicate(pathname, pattern)) {
      return routes[pattern]
    }
  }
  return
}
