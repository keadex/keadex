import { fabric } from 'fabric'
import { DiagramElementSpec } from '../models/autogenerated/DiagramElementSpec'
import { BOX, ELEMENT } from '../styles/style-constants'
import {
  C4BaseComponent,
  C4BaseComponentData,
  C4BaseComponentOptions,
} from './C4BaseComponent'
import { faLink } from '@fortawesome/free-solid-svg-icons'

export interface C4BaseBoxOptions extends C4BaseComponentOptions {
  widthBox?: number
  widthDescription?: number
  borderRadius?: number
}

export const C4BaseBox = (
  data: C4BaseComponentData,
  elementSpec: DiagramElementSpec,
  options: C4BaseBoxOptions
): C4BaseComponent => {
  const objects: fabric.Object[] = []

  // ----- Box
  const box = createBox(data, options)
  objects.push(box)

  // ----- Tags
  let tags
  if (data.base_data?.tags) {
    tags = createTags(box, data, options)
    objects.push(tags)
  }

  // ----- Label
  const label = createLabel(box, tags, data, options)
  objects.push(label)

  // ----- Type / Technology
  const typeTechnology = createTypeTechnology(box, label, data, options)
  objects.push(typeTechnology)

  // ----- Description
  let description
  if (data.base_data?.description) {
    description = createDescription(box, typeTechnology, data, options)
    objects.push(description)
  }

  if (data.base_data?.link) {
    objects.push(createLinkIcon(box, options))
  }

  // adjust height of the box basing on its content
  adjustBoxHeight(box, description)

  const defaults: DiagramElementSpec = {
    alias: data.base_data?.alias,
    position: {
      left: ELEMENT.SIZES.DEFAULT_LEFT,
      top: ELEMENT.SIZES.DEFAULT_TOP,
    },
  }

  return new C4BaseComponent(data, elementSpec, defaults, objects)
}

const createBox = (
  data: C4BaseComponentData,
  options: C4BaseBoxOptions
): fabric.Object => {
  const box = new fabric.Rect({
    fill: options.bgColor,
    stroke: options.borderColor,
    strokeWidth: ELEMENT.SIZES.BORDER_WIDTH,
    left: ELEMENT.SIZES.DEFAULT_LEFT,
    top: ELEMENT.SIZES.DEFAULT_TOP,
    width: options.widthBox ?? BOX.SIZES.WIDTH,
    height: BOX.SIZES.MIN_HEIGHT,
    name: data.base_data?.alias ?? 'undefined',
    rx: options.borderRadius ?? BOX.SIZES.BORDER_RADIUS,
    ry: options.borderRadius ?? BOX.SIZES.BORDER_RADIUS,
  })

  box.on('scaling', (e) => {
    if (
      e.target?.width &&
      e.target.height &&
      e.target.scaleX &&
      e.target.scaleY
    ) {
      e.target.set({
        width: e.target.width * e.target.scaleX,
        height: e.target.height * e.target.scaleY,
        scaleX: 1,
        scaleY: 1,
      })
    }
  })
  return box
}

const createTags = (
  box: fabric.Rect,
  data: C4BaseComponentData,
  options: C4BaseBoxOptions
): fabric.Object => {
  return new fabric.Text(`«${data.base_data?.tags}»`, {
    fill: options.textColor,
    fontFamily: ELEMENT.FONT.FAMILY,
    fontSize: BOX.FONT.SIZE_TAG,
    fontStyle: 'italic',
    fontWeight: 'normal',
    textAlign: 'center',
    originX: 'center',
    originY: 'top',
    left: (box.left ?? ELEMENT.SIZES.DEFAULT_LEFT) + (box.width ?? 0) / 2,
    top: (box.top ?? ELEMENT.SIZES.DEFAULT_TOP) + BOX.SIZES.TOP_TAGS,
  })
}

const createLabel = (
  box: fabric.Rect,
  tags: fabric.Object | undefined,
  data: C4BaseComponentData,
  options: C4BaseBoxOptions
): fabric.Object => {
  return new fabric.Text(data.base_data?.label ?? 'undefined', {
    fill: options.textColor,
    fontFamily: ELEMENT.FONT.FAMILY,
    fontSize: BOX.FONT.SIZE,
    fontWeight: 'bold',
    textAlign: 'center',
    originX: 'center',
    originY: 'top',
    left: (box.left ?? ELEMENT.SIZES.DEFAULT_LEFT) + (box.width ?? 0) / 2,
    top: (tags?.top ?? ELEMENT.SIZES.DEFAULT_TOP) + BOX.SIZES.TOP_LABEL,
  })
}

const createTypeTechnology = (
  box: fabric.Rect,
  label: fabric.Object | undefined,
  data: C4BaseComponentData,
  options: C4BaseBoxOptions
): fabric.Object => {
  const text = `[${
    data.boundary_custom_type ??
    data.boundary_type ??
    data.component_type ??
    data.container_type ??
    data.deployment_node_type ??
    data.deploymeny_node_custom_type ??
    data.person_type ??
    data.system_type
  }${data.technology ? `: ${data.technology}` : ''}]`
  return new fabric.Text(text, {
    fill: options.textColor,
    fontFamily: ELEMENT.FONT.FAMILY,
    fontSize: BOX.FONT.SIZE_TYPE_TECHNOLOGY,
    fontWeight: 'normal',
    textAlign: 'center',
    originX: 'center',
    originY: 'top',
    left: (box.left ?? ELEMENT.SIZES.DEFAULT_LEFT) + (box.width ?? 0) / 2,
    top:
      (label?.top ?? ELEMENT.SIZES.DEFAULT_TOP) + BOX.SIZES.TOP_TYPE_TECHNOLOGY,
  })
}

const createDescription = (
  box: fabric.Rect,
  typeDescription: fabric.Object | undefined,
  data: C4BaseComponentData,
  options: C4BaseBoxOptions
): fabric.Object => {
  const width = options.widthDescription ?? box.width
  return new fabric.Textbox(data.base_data?.description ?? '', {
    fill: options.textColor,
    fontFamily: ELEMENT.FONT.FAMILY,
    fontSize: BOX.FONT.SIZE_DESCRIPTION,
    fontWeight: 400,
    opacity: 0.7,
    splitByGrapheme: true,
    width: width ? width - BOX.SIZES.PADDING_Y_DESCRIPTION : 0,
    textAlign: 'center',
    originX: 'center',
    originY: 'top',
    left: (box.left ?? ELEMENT.SIZES.DEFAULT_LEFT) + (box.width ?? 0) / 2,
    top: (typeDescription?.top ?? 0) + BOX.SIZES.TOP_DESCRIPTION,
  })
}

const createLinkIcon = (
  box: fabric.Rect,
  options: C4BaseBoxOptions
): fabric.Object => {
  const path = new fabric.Path(faLink.icon[4].toString(), {
    fill: options.textColor,
    opacity: 1,
    originX: 'left',
    originY: 'top',
    left: (box.left ?? 0) + 5,
    top: (box.top ?? 0) + 5,
  })
  path.scaleToWidth(10)
  return path
}

const adjustBoxHeight = (
  box: fabric.Object,
  lastObject: fabric.Object | undefined
) => {
  let newHeight =
    (lastObject?.height ?? 0) +
    ((lastObject?.top ?? 0) - (box?.top ?? 0)) +
    BOX.SIZES.PADDING_BOTTOM
  if (newHeight < BOX.SIZES.MIN_HEIGHT) newHeight = BOX.SIZES.MIN_HEIGHT
  box.height = newHeight
}

export default C4BaseBox
