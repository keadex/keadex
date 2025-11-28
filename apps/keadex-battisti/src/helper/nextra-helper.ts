import { PageMapItem } from 'nextra'

export type PageMapItemOverride = {
  position?: number
  title?: string
}

export type PageMapOverrides = Map<string, PageMapItemOverride>

export function applyPageMapOverrides(
  pageMap: PageMapItem[],
  overrides: PageMapOverrides,
): PageMapItem[] {
  return pageMap
    .map((item) => {
      const fixedItem = { ...item } as PageMapItem & PageMapItemOverride
      if ('route' in fixedItem || 'href' in fixedItem) {
        let override
        if ('route' in fixedItem) {
          fixedItem.route = `/en/docs${fixedItem.route}`
          override = overrides.get(fixedItem.route) || {}
        } else if ('href' in fixedItem) {
          override = overrides.get(fixedItem.href as string) || {}
        }
        if (override?.title) {
          fixedItem.title = override.title
        }
        if (override?.position !== undefined) {
          fixedItem.position = override.position
        }
      }
      if ('children' in fixedItem && Array.isArray(fixedItem.children)) {
        fixedItem.children = applyPageMapOverrides(
          fixedItem.children,
          overrides,
        )
      }
      return fixedItem
    })
    .sort((a, b) => {
      const posA =
        (a as PageMapItem & PageMapItemOverride).position ??
        Number.MAX_SAFE_INTEGER
      const posB =
        (b as PageMapItem & PageMapItemOverride).position ??
        Number.MAX_SAFE_INTEGER
      return posA - posB
    })
}
