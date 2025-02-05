import { DropdownMenuItemProps } from '@keadex/keadex-ui-kit/cross'
import { fabric } from 'fabric'
import { IEvent } from 'fabric/fabric-impl'
import { OBJECT_EVENTS } from '../constants/fabric-events'
import { getAutoPosition } from '../helper/diagram-helper'
import {
  filterVirtualGroups,
  flatVirtualGroupChildren,
  getBoundingBox,
  getCanvasPan,
  getZIndexOfObject,
} from '../helper/fabric-helper'
import { DiagramElementSpec } from '../models/autogenerated/DiagramElementSpec'
import { DiagramSpec } from '../models/autogenerated/DiagramSpec'
import { ElementData } from '../models/autogenerated/ElementData'
import { Shape } from '../models/autogenerated/Shape'
import {
  renderElements,
  RenderElementsOptions,
} from '../rendering-system/diagram-renderer'
import { BASE_ELASTIC_CONTAINER, BOX, ELEMENT } from '../styles/style-constants'
import {
  C4BaseComponent,
  C4BaseComponentData,
  C4BaseComponentOptions,
  createBaseContextMenuItems,
  isC4Component,
  VirtualGroupSelection,
} from './C4BaseComponent'

export enum BaseElasticContainerObjects {
  Rectangle = 'RECTANGLE',
  Footer = 'FOOTER',
}

export class C4BaseElastiContainerComponent extends C4BaseComponent {
  override getUpdatedSpecs(): DiagramElementSpec | undefined {
    const updatedSpecs = super.getUpdatedSpecs()
    if (updatedSpecs) {
      // Discard active object since it is a fabric.ActiveSelection
      // and affects dimensions
      this.canvas?.discardActiveObject()

      // Delete positions and size props since this is a virtual group
      delete updatedSpecs.position
      delete updatedSpecs.size

      updatedSpecs.inner_specs = []
      updatedSpecs.shapes = []
      if (this.children) {
        for (const object of this.children) {
          if (isC4Component(object)) {
            // Case where the child is another C4 component
            const objectUpdatedSpecs = object.getUpdatedSpecs()
            if (objectUpdatedSpecs)
              updatedSpecs.inner_specs.push(objectUpdatedSpecs)
          } else if (object.name !== BaseElasticContainerObjects.Footer) {
            // Case where the child is a shape of the base elastic container.
            updatedSpecs.shapes.push({
              position: {
                left: object.left,
                top: object.top,
                z_index: getZIndexOfObject(object.canvas, object),
              },
              size: {
                scale_x: object.scaleX ?? 1,
                scale_y: object.scaleY ?? 1,
              },
              shape_type: object.name as BaseElasticContainerObjects,
            })
          } else {
            // In the case of the footer we need to save only the zIndex,
            // since all the other properties are calculated from the box.
            updatedSpecs.shapes.push({
              position: {
                z_index: getZIndexOfObject(object.canvas, object),
              },
              shape_type: object.name,
            })
          }
        }
      }
    }
    return updatedSpecs
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface C4BaseElasticContainerOptions extends C4BaseComponentOptions {}

export const C4BaseElasticContainer = (
  data: C4BaseComponentData,
  elementSpec: DiagramElementSpec,
  diagramSpec: DiagramSpec,
  autoLayout: Record<string, ElementData>,
  options: C4BaseElasticContainerOptions,
  renderElementsOptions: RenderElementsOptions | undefined,
): C4BaseElastiContainerComponent => {
  const defaults: DiagramElementSpec = {
    alias: data.base_data?.alias,
  }
  const parent = new C4BaseElastiContainerComponent(
    data,
    elementSpec,
    defaults,
    autoLayout,
    [],
    undefined,
    undefined,
    undefined,
    true,
  )
  parent.visible = false

  // ----- Box
  const box = createBox(elementSpec, autoLayout, options, parent)

  // ----- Footer
  createFooter(elementSpec, options, data, box, parent)

  // ----- Inner Objects
  let innerObjects: C4BaseComponent[] = []
  if (data.sub_elements) {
    innerObjects = renderElements(
      undefined,
      data.sub_elements,
      diagramSpec,
      autoLayout,
      {
        ...renderElementsOptions,
        skipAddToCanvas: true,
        skipLegendRendering: true,
      },
    )
    innerObjects.forEach((innerObject) => {
      innerObject.parent = parent
      parent.children?.push(innerObject)
    })
  }

  resizeBox(parent)

  attachListenersToBaseElasticContainer(parent)

  return parent
}

const createBox = (
  elementSpecs: DiagramElementSpec,
  autoLayout: Record<string, ElementData>,
  options: C4BaseElasticContainerOptions,
  parent: C4BaseElastiContainerComponent,
): fabric.Rect => {
  const boxSpecs = elementSpecs?.shapes?.filter(
    (shape) => shape.shape_type === BaseElasticContainerObjects.Rectangle,
  )[0] as Shape

  const box = new fabric.Rect({
    fill: options.bgColor,
    stroke: options.borderColor,
    strokeWidth: ELEMENT.SIZES.BORDER_WIDTH,
    strokeDashArray: options.strokeDashArray,
    left:
      boxSpecs?.position?.left ??
      getAutoPosition(elementSpecs.alias, autoLayout).left,
    top:
      boxSpecs?.position?.top ??
      getAutoPosition(elementSpecs.alias, autoLayout).top,
    name: BaseElasticContainerObjects.Rectangle,
    rx: BOX.SIZES.BORDER_RADIUS,
    ry: BOX.SIZES.BORDER_RADIUS,
    scaleX: boxSpecs?.size?.scale_x ?? 1,
    scaleY: boxSpecs?.size?.scale_y ?? 1,
  })
  box.data = {
    rawDiagramElementSpec: boxSpecs,
  }
  box.parent = parent
  attachListenersToBox(box)
  parent.children?.push(box)
  return box
}

const createFooter = (
  elementSpecs: DiagramElementSpec | undefined,
  options: C4BaseElasticContainerOptions,
  data: C4BaseComponentData,
  box: fabric.Rect,
  parent: C4BaseElastiContainerComponent,
): fabric.Group => {
  const footerSpecs = elementSpecs?.shapes?.filter(
    (shape) => shape.shape_type === BaseElasticContainerObjects.Footer,
  )[0] as Shape

  const objects: fabric.Object[] = []
  const textOptions: fabric.TextOptions = {
    fontFamily: ELEMENT.FONT.FAMILY,
    fill: options.textColor,
  }
  if (data.base_data?.label) {
    const label = new fabric.Text(data.base_data.label, {
      ...textOptions,
      fontSize: BASE_ELASTIC_CONTAINER.FONT.SIZE_LABEL,
      fontWeight: 'bold',
    })
    label.top = 0
    label.left = 0
    objects.push(label)
  }

  let typeTechnology = data.boundary_type ?? data.deployment_node_type ?? ''
  typeTechnology =
    data.boundary_custom_type ??
    data.deploymeny_node_custom_type ??
    typeTechnology
  typeTechnology += data.technology ? `: ${data.technology}` : ''
  typeTechnology = `[${typeTechnology}]`
  const technology = new fabric.Text(typeTechnology, {
    ...textOptions,
    fontSize: BASE_ELASTIC_CONTAINER.FONT.SIZE_TYPE_TECHNOLOGY,
    left: 0,
    top: objects[0].height ?? 0,
  })
  objects.push(technology)

  const footer = new fabric.Group(objects, {
    name: BaseElasticContainerObjects.Footer,
    selectable: false,
    evented: false,
    left: box.left,
    top: box.top,
    scaleX: box.scaleX,
    scaleY: box.scaleY,
  })
  footer.data = {
    rawDiagramElementSpec: footerSpecs,
  }
  footer.parent = parent
  attachListenersToFooter(footer)
  parent.children?.push(footer)
  return footer
}

// --------------- UTILITIES
const resizeBox = (parent: C4BaseElastiContainerComponent) => {
  let box: fabric.Object | undefined
  let footer: fabric.Object | undefined
  const innerElements: fabric.Object[] = []

  parent.children?.forEach((child) => {
    if (child.name === BaseElasticContainerObjects.Footer) footer = child
    else if (child.name === BaseElasticContainerObjects.Rectangle) box = child
    else innerElements.push(child)
  })

  const boundingBox = getBoundingBox(
    flatVirtualGroupChildren(innerElements),
    false,
  )
  const scaleX = box?.scaleX ?? 1
  const scaleY = box?.scaleY ?? 1
  const zoom = box?.canvas?.getZoom() ?? 1
  const pan = getCanvasPan(parent.canvas)

  const paddingBoxX = BASE_ELASTIC_CONTAINER.SIZES.PADDING_BOX * scaleX
  const paddingBoxY = BASE_ELASTIC_CONTAINER.SIZES.PADDING_BOX * scaleY
  const paddingFooterX = BASE_ELASTIC_CONTAINER.SIZES.PADDING_BOX * scaleX
  const paddingFooterY = BASE_ELASTIC_CONTAINER.SIZES.PADDING_BOX * scaleY

  if (
    box &&
    boundingBox.left !== undefined &&
    boundingBox.right !== undefined &&
    boundingBox.top !== undefined &&
    boundingBox.bottom !== undefined &&
    boundingBox.width !== undefined &&
    boundingBox.height !== undefined &&
    footer !== undefined
  ) {
    boundingBox.left = (boundingBox.left - pan.panX) / zoom
    boundingBox.top = (boundingBox.top - pan.panY) / zoom
    boundingBox.right = (boundingBox.right - pan.panX) / zoom
    boundingBox.bottom = (boundingBox.bottom - pan.panY) / zoom
    boundingBox.width = boundingBox.right - boundingBox.left
    boundingBox.height = boundingBox.bottom - boundingBox.top

    // "* 2" is needed to include padding for both the sides (left and right, top and bottom)
    box.width = boundingBox.width / scaleX + (paddingBoxX / scaleX) * 2
    // "* 3" is needed to include padding for both the sides (left and right, top and bottom)
    // and the padding between the footer and the inner elements
    box.height =
      boundingBox.height / scaleY +
      (paddingBoxY / scaleY) * 3 +
      (footer.height ?? 0)

    box.left = boundingBox.left - paddingBoxX
    box.top = boundingBox.top - paddingBoxY
  } else if (box && footer !== undefined) {
    // Case when the bounding box is undefined since there are no inner elements
    box.width = BASE_ELASTIC_CONTAINER.SIZES.MIN_WIDTH
    box.height =
      BASE_ELASTIC_CONTAINER.SIZES.MIN_HEIGHT + footer.getScaledHeight()
  }
  parent.canvas?.renderAll()

  // Adjust position of the footer
  if (
    box &&
    footer &&
    box.left !== undefined &&
    box.top !== undefined &&
    box.height !== undefined &&
    footer.height !== undefined
  ) {
    footer.top =
      box.top +
      box.getScaledHeight() -
      footer.getScaledHeight() -
      paddingFooterY
    footer.left = box.left + paddingFooterX
  }
  box?.setCoords()
  footer?.setCoords()
}

// --------------- LISTENERS
const attachListenersToBaseElasticContainer = (
  parent: C4BaseElastiContainerComponent,
) => {
  parent.children?.forEach((object) => {
    object.on(OBJECT_EVENTS.MODIFIED, (event) => {
      onBaseElasticContainerModified(parent, event)
    })
    if (object.children) {
      object.children.forEach((object) => {
        object.on(OBJECT_EVENTS.MODIFIED, (event) => {
          onBaseElasticContainerModified(parent, event)
        })
      })
    }
  })
}

const attachListenersToBox = (box: fabric.Rect) => {
  box.on(OBJECT_EVENTS.SELECTED, (e) => {
    onBaseElasticContainerSelected(e, box)
  })
}

const attachListenersToFooter = (footer: fabric.Group) => {
  footer.on(OBJECT_EVENTS.SELECTED, (e) => {
    onBaseElasticContainerSelected(e, footer)
  })
}

const onBaseElasticContainerSelected = (
  event: fabric.IEvent<Event>,
  object: fabric.Object,
) => {
  if (event.e && object.parent?.children) {
    const parent = object.parent as C4BaseElastiContainerComponent
    const filteredVirtualGroups = filterVirtualGroups(
      object.canvas?.getActiveObjects(),
    )

    object.canvas?.discardActiveObject()

    let selection: fabric.ActiveSelection | VirtualGroupSelection
    if (
      filteredVirtualGroups.filteredObjects.length > 0 ||
      filteredVirtualGroups.virtualGroupsRoots.size > 1
    ) {
      let selectedObjects = filteredVirtualGroups.filteredObjects
      filteredVirtualGroups.virtualGroupsRoots.forEach(
        (virtualGroupRoot) =>
          (selectedObjects = selectedObjects.concat(
            flatVirtualGroupChildren(virtualGroupRoot.children ?? [], false),
          )),
      )
      selection = new fabric.ActiveSelection(selectedObjects, {
        canvas: object.canvas,
      })
    } else {
      // Select all the children of the virtual group. Since the base elastic container
      // can include nested virtual groups, it is needed to flat all the children.
      selection = new VirtualGroupSelection(
        [...flatVirtualGroupChildren(parent.children ?? [], false)],
        {
          canvas: object.canvas,
        },
      )
      selection.parent = parent
      selection.on(OBJECT_EVENTS.MOUSE_UP, (event) => {
        onBaseElasticContainerMouseUp(
          selection.canvas,
          event,
          selection,
          parent,
        )
      })
      selection.on(OBJECT_EVENTS.MODIFIED, (event) => {
        object.canvas?.discardActiveObject()
        parent.fire(OBJECT_EVENTS.MODIFIED)
      })
    }
    object.canvas?.setActiveObject(selection)
    object.canvas?.requestRenderAll()
  }
}

const onBaseElasticContainerModified = (
  parent: C4BaseComponent,
  event: IEvent<Event> | undefined,
) => {
  if (!parent || !event) return
  // Resize box
  resizeBox(parent)
}

const createContextMenuItems = (
  canvas: fabric.Canvas,
  event: IEvent<Event>,
  selectedObject: fabric.Object,
): DropdownMenuItemProps[] => {
  if (selectedObject instanceof fabric.ActiveSelection) {
    return [
      {
        isHeaderMenuItem: true,
        id: 'baseElasticContainerContextMenu',
        label: '',
        hidden: true,
        alwaysOpen: true,
        subMenuItems: [
          ...createBaseContextMenuItems(canvas, event, selectedObject, false),
        ],
      },
    ]
  } else {
    return []
  }
}

const onBaseElasticContainerMouseUp = (
  canvas: fabric.Canvas | undefined,
  event: IEvent<Event>,
  selectedObject: fabric.Object,
  parent: C4BaseElastiContainerComponent,
) => {
  // Context menu on an elastic container is allowed when it is selected.
  // Each inner element handles its own context menu.
  if (!(selectedObject instanceof fabric.ActiveSelection)) return

  if (canvas)
    parent.onComponentMouseUp(
      canvas,
      event,
      selectedObject,
      createContextMenuItems(canvas, event, selectedObject),
    )
}

export default C4BaseElasticContainer
