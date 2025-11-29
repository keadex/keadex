import { PageMapItem } from 'nextra'

export type PageMapItemOverride = {
  position?: number
  title?: string
}

export type PageMapOverrides = Map<string, PageMapItemOverride>

export function fixRoute(
  pageMap: PageMapItem[],
  overrides: PageMapOverrides,
): PageMapItem[] {
  return pageMap.map((item) => {
    const fixedItem = { ...item } as PageMapItem & PageMapItemOverride
    if ('route' in fixedItem) {
      fixedItem.route = `/en/docs${fixedItem.route}`
    }
    if ('children' in fixedItem && Array.isArray(fixedItem.children)) {
      fixedItem.children = fixRoute(fixedItem.children, overrides)
    }
    return fixedItem
  })
}
