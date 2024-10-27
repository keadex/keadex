import { WindowTitlebarMenuFactory } from '../desktop'

export interface Routes<T, K, D = undefined> {
  [path: string]: Route<T, K, D>
}

export interface Route<T, K, D = undefined> {
  path: string
  titlebarMenuFactory?: WindowTitlebarMenuFactory<T, K>
  isAppMenuVisible?: boolean
  protectExit?: boolean
  data?: D
}

export function findRoute<T, K, D = undefined>(
  routeToFind: string,
  routes: Routes<T, K, D>,
  predicate?: (routeToFind: string, routeToCompare: string) => boolean,
): Route<T, K, D> | undefined {
  const defaultPredicate = (routeToFind: string, routeToCompare: string) => {
    return routeToFind.startsWith(routeToCompare)
  }
  for (const route of Object.keys(routes)) {
    if (
      predicate
        ? predicate(routeToFind, route)
        : defaultPredicate(routeToFind, route)
    ) {
      return routes[route]
    }
  }
  return
}
