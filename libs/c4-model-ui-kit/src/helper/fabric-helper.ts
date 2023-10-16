import { C4BaseComponent } from '../components/C4BaseComponent'
export function addObjectsToGroupAndKeepScale(
  group: fabric.Group,
  objects?: fabric.Object[]
) {
  const previousScaleX = group.scaleX ?? 1
  const previousScaleY = group.scaleY ?? 1

  if (!objects || objects.length === 0) group.addWithUpdate()
  else objects.forEach((object) => group.addWithUpdate(object))

  // Restore scale since addWithUpdate and removeWithUpdate reset scale to 1
  group.scaleX = 1 / previousScaleX
  group.scaleY = 1 / previousScaleY
  group.addWithUpdate()
  group.scaleX = previousScaleX
  group.scaleY = previousScaleY
}

export function getBoundingBox(
  objects: fabric.Object[],
  absolutePosition = true,
  transformMatrix?: any[]
): {
  left?: number
  right?: number
  top?: number
  bottom?: number
  width?: number
  height?: number
} {
  let left: number | undefined
  let right: number | undefined
  let bottom: number | undefined
  let top: number | undefined
  objects.forEach((object) => {
    if (object.visible) {
      const boundingRectCalculated = object.getBoundingRect(false, true)
      const boundingRectPosition = absolutePosition
        ? object.getBoundingRect(true, false)
        : boundingRectCalculated

      let localLeft = boundingRectPosition.left
      let localTop = boundingRectPosition.top
      if (transformMatrix && localLeft && localTop) {
        const transformedPoint = fabric.util.transformPoint(
          new fabric.Point(localLeft, localTop),
          transformMatrix
        )
        localLeft = transformedPoint.x
        localTop = transformedPoint.y
      }

      if (left === undefined || localLeft < left) left = localLeft
      if (
        localLeft !== undefined &&
        boundingRectCalculated.width !== undefined &&
        (right === undefined ||
          localLeft + boundingRectCalculated.width > right)
      )
        right = localLeft + boundingRectCalculated.width

      if (top === undefined || (localTop !== undefined && localTop < top))
        top = localTop
      if (
        localTop !== undefined &&
        boundingRectCalculated.height !== undefined &&
        (bottom === undefined ||
          boundingRectCalculated.height + localTop > bottom)
      )
        bottom = localTop + boundingRectCalculated.height
    }
  })

  return {
    left,
    right,
    top,
    bottom,
    width: (right ?? 0) - (left ?? 0),
    height: (bottom ?? 0) - (top ?? 0),
  }
}

export function getZIndexOfObject(
  canvas: fabric.Canvas | undefined,
  object: fabric.Object
): number | undefined {
  let zIndex = -1
  if (canvas) {
    zIndex = canvas.getObjects().indexOf(object)
  }
  return zIndex !== -1 ? zIndex : undefined
}

export function getMinZIndex(
  canvas: fabric.Canvas | undefined,
  objects: fabric.Object[],
  initZIndex = Number.MAX_SAFE_INTEGER
): number | undefined {
  let minZIndex = initZIndex
  objects.forEach((object) => {
    const zIndex = getZIndexOfObject(canvas, object)
    if (zIndex !== undefined && zIndex < minZIndex) minZIndex = zIndex
  })
  return minZIndex !== Number.MAX_SAFE_INTEGER ? minZIndex : undefined
}

export function filterVirtualGroups(objects?: fabric.Object[]): {
  filteredObjects: fabric.Object[]
  virtualGroupsRoots: Set<C4BaseComponent>
} {
  let filteredObjects: fabric.Object[] = []
  const virtualGroupsRoots: Set<C4BaseComponent> = new Set<C4BaseComponent>()
  if (objects) {
    // Extract the roots of the virtual group each object belongs to
    // (if it is included in a virtual group).
    let virtualGroupsWithChildren: fabric.Object[] = []
    objects.forEach((object) => {
      const virtualGroupRoot = object.getVirtualGroupRoot()
      if (virtualGroupRoot) virtualGroupsRoots.add(virtualGroupRoot)
    })
    // Merge in a unique array all the objects of all the virtual groups.
    virtualGroupsRoots.forEach((virtualGroupRoot) => {
      virtualGroupsWithChildren = virtualGroupsWithChildren.concat(
        flatVirtualGroupChildren(virtualGroupRoot.children ?? [], true)
      )
    })

    // Remove from the given objects, all the virtual groups and their children.
    // In this way will be kept only objects not included in a virtual group.
    filteredObjects = objects.filter(
      (object) => !virtualGroupsWithChildren.includes(object)
    )
  }
  return {
    filteredObjects,
    virtualGroupsRoots,
  }
}

export function flatVirtualGroupChildren(
  children: fabric.Object[],
  includeInvisible = true
) {
  let result: fabric.Object[] = []
  if (children) {
    children.forEach((object) => {
      if (object.visible || (!object.visible && includeInvisible))
        result.push(object)
      if (object.children)
        result = result.concat(
          flatVirtualGroupChildren(object.children, includeInvisible)
        )
    })
  }
  return result
}

export function getCanvasPan(canvas?: fabric.Canvas): {
  panX: number
  panY: number
} {
  let panX = 0,
    panY = 0
  if (canvas) {
    const viewportTransform = canvas.viewportTransform
    panX = viewportTransform ? viewportTransform[4] : 0
    panY = viewportTransform ? viewportTransform[5] : 0
  }
  return { panX, panY }
}
