/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  DropdownMenuItemProps,
  KeadexCanvas,
} from '@keadex/keadex-ui-kit/cross'
import { unescape } from '@keadex/keadex-utils'
import { fabric } from 'fabric'
import { IEvent } from 'fabric/fabric-impl'
import { OBJECT_EVENTS } from '../constants/fabric-events'
import {
  filterVirtualGroups,
  flatVirtualGroupChildren,
  getBoundingBox,
  getCanvasPan,
  getZIndexOfObject,
} from '../helper/fabric-helper'
import { getCustomTagsStyle, parseTags } from '../helper/tags-helper'
import { AddElementTag } from '../models/autogenerated/AddElementTag'
import { DiagramElementSpec } from '../models/autogenerated/DiagramElementSpec'
import { ElementData } from '../models/autogenerated/ElementData'
import { Shape } from '../models/autogenerated/Shape'
import { ShapeType } from '../models/autogenerated/ShapeType'
import { RenderElementsOptions } from '../rendering-system/diagram-renderer'
import { ELEMENT, RELATIONSHIP } from '../styles/style-constants'
import {
  C4BaseComponent,
  C4BaseComponentData,
  ExtendedPoint,
  VirtualGroupSelection,
  createBaseContextMenuItems,
} from './C4BaseComponent'
import { getSupportedBorderStyle } from '../helper/style-helper'

export enum RelObjects {
  Dot = 'DOT',
  Line = 'LINE',
  Text = 'TEXT',
  Triangle = 'TRIANGLE',
  Rectangle = 'RECTANGLE',
}

export class C4RelationshipComponent extends C4BaseComponent {
  override getUpdatedSpecs(): DiagramElementSpec | undefined {
    const relationshipUpdatedSpecs = super.getUpdatedSpecs()
    if (relationshipUpdatedSpecs) {
      // Discard active object since it is a fabric.ActiveSelection
      // and affects dimensions
      this.canvas?.discardActiveObject()

      // Delete positions and size props since this is a virtual group
      delete relationshipUpdatedSpecs.position
      delete relationshipUpdatedSpecs.size

      relationshipUpdatedSpecs.shapes = []
      this.children?.forEach((srcChild) => {
        // Clone of the Fabric object is required because it will be rotated to calculate
        // the new position. Without cloning, you will see on the canvas
        // the rotation of the object during the save process.
        const child = fabric.util.object.clone(srcChild)
        if (
          child.name === RelObjects.Line ||
          child.name === RelObjects.Rectangle
        ) {
          // In the case of the line and rectangle we need to save only the zIndex,
          // since all the other properties are calculated from the other shapes.
          relationshipUpdatedSpecs.shapes!.push({
            position: {
              z_index: getZIndexOfObject(child.canvas, child),
            },
            shape_type: child.name,
          })
        } else {
          let left = 0,
            top = 0
          const childAngle = child.angle
          if (child.name === RelObjects.Text) {
            left = child.getCenterPoint().x
            top = child.getCenterPoint().y
          } else if (
            child.name === RelObjects.Dot ||
            child.name === RelObjects.Triangle
          ) {
            // Since the head of the arrow will rotate when moving points,
            // you need to reset the angle to store the correct position
            // to be restored
            if (child.name === RelObjects.Triangle)
              child.rotate(RELATIONSHIP.POSITION.DEFAULT_HEAD_ARROW_ANGLE)

            const dotPosition = calculateDotPosition(
              this.canvas,
              child.left!,
              child.top!,
              child.name === RelObjects.Triangle,
              childAngle,
              child.scaleX,
              child.scaleY,
              true,
            )
            left = dotPosition.left
            top = dotPosition.top
          }

          const shape: Shape = {
            position: {
              left,
              top,
              z_index: getZIndexOfObject(child.canvas, child),
            },
            size: {
              scale_x: child.scaleX ?? 1,
              scale_y: child.scaleY ?? 1,
            },
            shape_type: child.name as RelObjects,
          }

          // Only the head of the arrow has an angle
          if (child.name === RelObjects.Triangle) {
            shape.position!.angle = childAngle
          }

          relationshipUpdatedSpecs.shapes!.push(shape)
        }
      })
    }
    return relationshipUpdatedSpecs
  }
}

export const C4Relationship = (
  data: C4BaseComponentData,
  elementSpec: DiagramElementSpec,
  autoLayout: Record<string, ElementData>,
  renderElementsOptions: RenderElementsOptions | undefined,
): C4RelationshipComponent => {
  const customTagsStyle = getCustomTagsStyle(
    parseTags(data.base_data?.tags),
    renderElementsOptions?.tags,
  )
  const defaults: DiagramElementSpec = {
    alias: data.base_data?.alias,
  }
  let scale = 1
  const savedDots = elementSpec.shapes?.filter(
    (shape) => shape.shape_type === RelObjects.Dot,
  )
  if (savedDots && savedDots.length > 0) scale = savedDots[0].size?.scale_x ?? 1

  const parent = new C4RelationshipComponent(
    data,
    elementSpec,
    defaults,
    autoLayout,
    [],
    {
      visible: false,
      selectable: false,
    },
    undefined,
    undefined,
    true,
  )

  const dotPoints = createPoints(
    elementSpec,
    autoLayout,
    renderElementsOptions?.autoLayoutOnlyStraightArrows,
  )
  const dots = createDots(
    elementSpec,
    autoLayout,
    dotPoints,
    parent,
    customTagsStyle?.border_color ??
      renderElementsOptions?.diagramsThemeSettings?.line_color_relationship,
  )

  const linePoints = dots.map(
    (dot) =>
      new ExtendedPoint(
        dot.getCenterPoint().x,
        dot.getCenterPoint().y,
        dot.name as ShapeType,
      ),
  )
  const line = createLine(
    elementSpec,
    linePoints,
    parent,
    scale,
    customTagsStyle?.border_color ??
      renderElementsOptions?.diagramsThemeSettings?.line_color_relationship,
    autoLayout,
    renderElementsOptions?.autoLayoutOnlyStraightArrows,
    getSupportedBorderStyle(customTagsStyle?.border_style)?.value,
  )

  createBackground(elementSpec, dots, parent, undefined)

  createText(
    data,
    elementSpec,
    autoLayout,
    line,
    dots,
    parent,
    renderElementsOptions,
    customTagsStyle,
  )

  reorderObjects(parent)

  return parent
}

// --------------- UTILITIES
const reorderObjects = (parent: C4RelationshipComponent) => {
  parent.children = parent.children?.sort((a, b) => {
    if (
      a.name === RelObjects.Rectangle ||
      (a.name === RelObjects.Line && b.name !== RelObjects.Rectangle)
    )
      return -1
    else if (
      b.name === RelObjects.Rectangle ||
      (a.name !== RelObjects.Rectangle && b.name === RelObjects.Line)
    )
      return 1
    else if (a.name === b.name) return 0
    else return 1
  })
}

const updateLinePoints = (line: fabric.Polyline) => {
  const parent = line.parent as C4RelationshipComponent
  let headArrow: fabric.Object | undefined
  let scale = 1
  const canvas = line.canvas

  if (parent && canvas) {
    const newPoints: ExtendedPoint[] = []
    const dots: fabric.Object[] = []
    if (parent.children) {
      parent.children.forEach((child) => {
        if (child.name === RelObjects.Triangle) headArrow = child
        if (
          child.name === RelObjects.Dot ||
          child.name === RelObjects.Triangle
        ) {
          dots.push(child)
          scale = child.scaleX ?? 1
          const childPoint = child.getPointByOrigin('center', 'center')
          const newPoint = new ExtendedPoint(
            childPoint.x,
            childPoint.y,
            child.name,
          )
          newPoints.push(newPoint)
        }
      })

      // Remove and re-create the line
      let index = parent.children.findIndex(
        (child) => child.name === RelObjects.Line,
      )
      if (index !== undefined && index > -1) {
        parent.children.splice(index, 1)
      }
      const canvasIndexOldLine = getZIndexOfObject(canvas, line)
      const oldLineSpecs = line.data?.rawDiagramElementSpec
      const oldLineColor = line.stroke
      const oldLineDashArray = line.strokeDashArray
      canvas.remove(line)
      const newLine = createLine(
        oldLineSpecs,
        newPoints,
        parent,
        scale,
        oldLineColor,
        undefined,
        undefined,
        oldLineDashArray,
      )
      canvas.add(newLine)
      if (canvasIndexOldLine) newLine.moveTo(canvasIndexOldLine)

      // Remove and re-create the background
      index = parent.children.findIndex(
        (child) => child.name === RelObjects.Rectangle,
      )
      const oldBackground = parent.children[index]
      const canvasIndexOldBg = getZIndexOfObject(canvas, oldBackground)
      const oldBgSpecs = oldBackground.data?.rawDiagramElementSpec
      canvas.remove(oldBackground)
      if (index !== undefined && index > -1) {
        parent.children.splice(index, 1)
      }
      const newBackground = createBackground(oldBgSpecs, dots, parent, canvas)
      canvas.add(newBackground)
      if (canvasIndexOldBg) newBackground.moveTo(canvasIndexOldBg)

      if (headArrow) adjustAngleHeadArrow(newPoints, headArrow)
    }
  }
}

const getAngleHeadArrow = (linePoints: ExtendedPoint[]): number => {
  const indexHeadArrow = linePoints.findIndex(
    (point) => point.customType === RelObjects.Triangle,
  )

  const headArrowPoint = linePoints[indexHeadArrow]
  const previousPoint =
    linePoints[indexHeadArrow > 0 ? indexHeadArrow - 1 : indexHeadArrow + 1]
  const angle =
    (Math.atan2(
      headArrowPoint.y - previousPoint.y,
      headArrowPoint.x - previousPoint.x,
    ) *
      180) /
      Math.PI +
    90
  return angle
}

const adjustAngleHeadArrow = (
  linePoints: ExtendedPoint[] | undefined,
  headArrow: fabric.Triangle,
) => {
  let angle
  if (linePoints) {
    angle = getAngleHeadArrow(linePoints)
    headArrow.rotate(angle)
  }
}

const sortLinePoints = (line: fabric.Polyline, newLineDot: fabric.Object) => {
  const parent = line.parent
  if (parent) {
    let text
    let rectangle
    const lineDots = []
    parent.children?.forEach((child) => {
      if (child.name === RelObjects.Text) text = child
      else if (child.name === RelObjects.Rectangle) rectangle = child
      else if (
        child.name === RelObjects.Dot ||
        child.name === RelObjects.Triangle
      )
        lineDots.push(child)
    })
    // -- OPTION 1
    lineDots.push(newLineDot)
    lineDots.sort((a, b) => {
      return a.getCenterPoint().x - b.getCenterPoint().x
    })

    // -- OPTION 2
    // lineDots.push(newLineDot)
    // lineDots.sort((a, b) => {
    //   if (
    //     a.getCenterPoint().distanceFrom(newLinePoint) <
    //     b.getCenterPoint().distanceFrom(newLinePoint)
    //   )
    //     return -1
    //   else if (
    //     a.getCenterPoint().distanceFrom(newLinePoint) >
    //     b.getCenterPoint().distanceFrom(newLinePoint)
    //   )
    //     return 1
    //   else return 0
    // })

    // -- OPTION 3
    // let indexNewPoint = 0
    // let foundPosition = false
    // while (indexNewPoint < lineDots.length - 1 && !foundPosition) {
    //   if (
    //     newLinePoint.x >
    //       Math.min(
    //         lineDots[indexNewPoint].getCenterPoint().x,
    //         lineDots[indexNewPoint + 1].getCenterPoint().x
    //       ) &&
    //     newLinePoint.x <
    //       Math.max(
    //         lineDots[indexNewPoint].getCenterPoint().x,
    //         lineDots[indexNewPoint + 1].getCenterPoint().x
    //       ) &&
    //     newLinePoint.y >
    //       Math.min(
    //         lineDots[indexNewPoint].getCenterPoint().y,
    //         lineDots[indexNewPoint + 1].getCenterPoint().y
    //       ) &&
    //     newLinePoint.y <
    //       Math.max(
    //         lineDots[indexNewPoint].getCenterPoint().y,
    //         lineDots[indexNewPoint + 1].getCenterPoint().y
    //       )
    //   ) {
    //     foundPosition = true
    //   }
    //   indexNewPoint++
    // }
    // lineDots.splice(indexNewPoint, 0, newLineDot)
    parent.children = lineDots
    parent.children.push(line)
    if (text) parent.children.push(text)
    if (rectangle) parent.children.push(rectangle)
  }
}

const calculateDotPosition = (
  canvas: fabric.Canvas | undefined,
  x: number,
  y: number,
  isHeadArrow: boolean,
  angle = RELATIONSHIP.POSITION.DEFAULT_HEAD_ARROW_ANGLE,
  scaleX = 1,
  scaleY = 1,
  saveMode: boolean,
): { left: number; top: number; angle: number } => {
  const zoom = canvas?.getZoom() ?? 1
  const pan = getCanvasPan(canvas)

  let left = x,
    top = y
  if (isHeadArrow) {
    const leftOffset =
      (RELATIONSHIP.SIZES.SIZE_TRIANGLE * scaleX) / 2 +
      (RELATIONSHIP.SIZES.STROKE_WIDTH * scaleX) / 2
    const topOffset =
      (RELATIONSHIP.SIZES.SIZE_TRIANGLE * scaleY) / 2 +
      (RELATIONSHIP.SIZES.STROKE_WIDTH * scaleY) / 2
    if (!saveMode) {
      left += leftOffset
      top -= topOffset
    } else {
      left -= leftOffset
      top += topOffset
    }
  } else {
    const leftOffset =
      RELATIONSHIP.SIZES.RADIUS_DOT * scaleX * 2 +
      (RELATIONSHIP.SIZES.STROKE_WIDTH * scaleX) / 2
    const topOffset =
      RELATIONSHIP.SIZES.RADIUS_DOT * scaleY +
      (RELATIONSHIP.SIZES.STROKE_WIDTH * scaleY) / 2
    if (!saveMode) {
      left -= leftOffset
      top -= topOffset
    } else {
      left += leftOffset
      top += topOffset
    }
  }

  if (!saveMode) {
    left = (left - pan.panX) / zoom
    top = (top - pan.panY) / zoom
  }

  return { left, top, angle }
}

const addNewPointToLine = (
  activeSelection: fabric.ActiveSelection,
  event: IEvent<Event>,
) => {
  const canvas = activeSelection.canvas
  if (event.pointer && canvas) {
    const line = activeSelection
      .getObjects()
      .filter((object) => object.name === RelObjects.Line)[0] as fabric.Polyline
    const dot = activeSelection
      .getObjects()
      .filter((object) => object.name === RelObjects.Dot)[0] as fabric.Circle
    canvas.discardActiveObject()
    const parent = line.parent as C4RelationshipComponent
    if (parent) {
      const newPoint = new ExtendedPoint(
        event.pointer.x,
        event.pointer.y,
        RelObjects.Dot,
      )
      const newDot = createDot(
        canvas,
        newPoint,
        undefined,
        false,
        parent,
        false,
        dot.scaleX,
        dot.scaleY,
        line.stroke,
        false,
      )
      sortLinePoints(line, newDot)
      canvas.add(newDot)
      updateLinePoints(line)
    }
  }
}

const removeExistingPointFromLine = (dot: fabric.Circle) => {
  const parent = dot.parent
  if (parent && dot.canvas) {
    const dots = parent.children?.filter(
      (child) =>
        child.name === RelObjects.Dot || child.name === RelObjects.Triangle,
    )
    if (dots !== undefined && dots.length > 2) {
      const line = parent.children?.filter(
        (child) => child.name === RelObjects.Line,
      )[0] as fabric.Polyline
      const index = parent.children?.findIndex((child) =>
        child.getCenterPoint().eq(dot.getCenterPoint()),
      )
      if (index !== undefined && index > -1) {
        parent.children?.splice(index, 1)
      }
      dot.canvas.remove(dot)
      updateLinePoints(line)
    }
  }
}

// --------------- OBJECTS
const createPoints = (
  elementSpec: DiagramElementSpec | undefined,
  autoLayout: Record<string, ElementData>,
  autoLayoutOnlyStraightArrows: boolean | undefined,
): ExtendedPoint[] => {
  let points: ExtendedPoint[] = []
  if (elementSpec?.shapes) {
    elementSpec?.shapes.forEach((shape) => {
      if (
        (shape.shape_type === RelObjects.Dot ||
          shape.shape_type === RelObjects.Triangle) &&
        shape.position?.left !== undefined &&
        shape.position?.top !== undefined
      ) {
        const point = new ExtendedPoint(
          shape.position.left,
          shape.position.top,
          shape.shape_type,
        )
        point.data = {
          rawDiagramElementSpec: shape,
        }
        points.push(point)
      }
    })
  } else {
    let defaultPoints
    if (
      elementSpec?.alias &&
      autoLayout[elementSpec.alias]?.start &&
      autoLayout[elementSpec.alias]?.end
    ) {
      defaultPoints = []
      // Start
      defaultPoints.push(
        new ExtendedPoint(
          autoLayout[elementSpec.alias].start!.x,
          autoLayout[elementSpec.alias].start!.y,
          RelObjects.Dot,
        ),
      )
      if (
        autoLayoutOnlyStraightArrows === false &&
        autoLayout[elementSpec.alias].path
      ) {
        autoLayout[elementSpec.alias].path!.forEach((pathPoint) => {
          defaultPoints.push(
            new ExtendedPoint(pathPoint.x, pathPoint.y, RelObjects.Dot),
          )
        })
      }
      // End
      defaultPoints.push(
        new ExtendedPoint(
          autoLayout[elementSpec.alias].end!.x,
          autoLayout[elementSpec.alias].end!.y,
          RelObjects.Triangle,
        ),
      )
    } else {
      defaultPoints = [
        new ExtendedPoint(
          ELEMENT.SIZES.DEFAULT_LEFT,
          ELEMENT.SIZES.DEFAULT_TOP,
          RelObjects.Dot,
        ),
        new ExtendedPoint(
          100 + ELEMENT.SIZES.DEFAULT_LEFT,
          ELEMENT.SIZES.DEFAULT_TOP,
          RelObjects.Triangle,
        ),
      ]
    }
    points = points.concat(defaultPoints)
  }
  return points
}

const createDots = (
  elementSpec: DiagramElementSpec | undefined,
  autoLayout: Record<string, ElementData>,
  points: ExtendedPoint[],
  parent: C4RelationshipComponent,
  lineColor: string | undefined,
): fabric.Object[] => {
  const dots: fabric.Object[] = []
  const autoLayoutEnabled =
    elementSpec?.alias !== undefined &&
    autoLayout[elementSpec.alias] !== undefined

  // Create new dots from points
  for (let i = 0; i < points.length; i++) {
    dots.push(
      createDot(
        undefined,
        points[i],
        points[i].customType === RelObjects.Triangle
          ? points[i].data?.rawDiagramElementSpec?.position?.angle ??
              getAngleHeadArrow(points)
          : undefined,
        points[i].customType === RelObjects.Triangle,
        parent,
        true,
        points[i].data?.rawDiagramElementSpec?.size?.scale_x,
        points[i].data?.rawDiagramElementSpec?.size?.scale_y,
        lineColor,
        autoLayoutEnabled,
      ),
    )
  }
  return dots
}

const createDot = (
  canvas: fabric.Canvas | undefined,
  point: ExtendedPoint,
  savedArrowAngle: number | undefined,
  isHeadArrow: boolean,
  parent: C4RelationshipComponent,
  updateParent = true,
  scaleX = 1,
  scaleY = 1,
  lineColor: string | undefined,
  autoLayoutEnabled: boolean,
): fabric.Object => {
  const { left, top, angle } = calculateDotPosition(
    canvas,
    point.x,
    point.y,
    isHeadArrow,
    savedArrowAngle,
    scaleX,
    scaleY,
    false,
  )

  if (isHeadArrow) {
    const headArrow = new fabric.Triangle({
      left: left,
      top: top,
      width: RELATIONSHIP.SIZES.SIZE_TRIANGLE,
      height: RELATIONSHIP.SIZES.SIZE_TRIANGLE,
      fill: lineColor ?? RELATIONSHIP.COLORS.LINE_COLOR,
      scaleX,
      scaleY,
      hasControls: false,
      name: RelObjects.Triangle,
      angle: RELATIONSHIP.POSITION.DEFAULT_HEAD_ARROW_ANGLE,
    })
    headArrow.rotate(angle)
    headArrow.data = {
      rawDiagramElementSpec: point.data?.rawDiagramElementSpec,
    }
    headArrow.parent = parent
    if (updateParent) parent.children?.push(headArrow)
    attachListenersToDot(headArrow)
    return headArrow
  } else {
    const dot = new fabric.Circle({
      left: left,
      top: top,
      radius: RELATIONSHIP.SIZES.RADIUS_DOT,
      fill: lineColor ?? RELATIONSHIP.COLORS.LINE_COLOR,
      opacity: 0.2,
      scaleX,
      scaleY,
      hasControls: false,
      name: RelObjects.Dot,
      visible: !autoLayoutEnabled,
    })
    dot.data = {
      rawDiagramElementSpec: point.data?.rawDiagramElementSpec,
    }
    dot.parent = parent
    if (updateParent) parent.children?.push(dot)
    attachListenersToDot(dot)
    return dot
  }
}

const createLine = (
  elementSpecs: DiagramElementSpec | undefined,
  points: ExtendedPoint[],
  parent: C4RelationshipComponent,
  scale = 1,
  lineColor: string | undefined,
  autoLayout: Record<string, ElementData> | undefined,
  autoLayoutOnlyStraightArrows: boolean | undefined,
  strokeDashArray: number[] | undefined,
): fabric.Polyline | fabric.Path => {
  const lineSpecs = elementSpecs?.shapes?.filter(
    (shape) => shape.shape_type === RelObjects.Line,
  )[0] as Shape

  let line
  if (
    autoLayoutOnlyStraightArrows === false &&
    autoLayout &&
    elementSpecs?.alias &&
    autoLayout[elementSpecs.alias]?.svg_path
  ) {
    // Curved lines are available only in auto layout mode
    line = new fabric.Path(autoLayout[elementSpecs.alias].svg_path, {
      stroke: lineColor ?? RELATIONSHIP.COLORS.LINE_COLOR,
      strokeDashArray,
      fill: '',
      strokeWidth: RELATIONSHIP.SIZES.STROKE_WIDTH * scale,
      scaleX: 1,
      scaleY: 1,
      name: RelObjects.Line,
    })
  } else {
    line = new fabric.Polyline(points, {
      stroke: lineColor ?? RELATIONSHIP.COLORS.LINE_COLOR,
      strokeDashArray,
      fill: '',
      strokeWidth: RELATIONSHIP.SIZES.STROKE_WIDTH * scale,
      scaleX: 1,
      scaleY: 1,
      name: RelObjects.Line,
    })
  }

  line.data = {
    rawDiagramElementSpec: lineSpecs,
  }
  line.parent = parent
  attachListenersToLine(line)
  parent.children?.push(line)
  return line
}

const createBackground = (
  elementSpecs: DiagramElementSpec | undefined,
  dots: fabric.Object[],
  parent: C4RelationshipComponent,
  canvas: fabric.Canvas | undefined,
): fabric.Rect => {
  const bgSpecs = elementSpecs?.shapes?.filter(
    (shape) => shape.shape_type === RelObjects.Rectangle,
  )[0] as Shape

  const boundingBox = getBoundingBox(dots, false)
  const pan = getCanvasPan(canvas)
  const zoom = canvas?.getZoom() ?? 1
  if (boundingBox.left && boundingBox.top) {
    boundingBox.left = (boundingBox.left - pan.panX) / zoom
    boundingBox.top = (boundingBox.top - pan.panY) / zoom
  }
  if (boundingBox.width && boundingBox.height) {
    boundingBox.width = boundingBox.width / zoom
    boundingBox.height = boundingBox.height / zoom
  }
  const rectangle = new fabric.Rect({
    stroke: '',
    fill: '',
    name: RelObjects.Rectangle,
    left: boundingBox.left,
    top: boundingBox.top,
    width: boundingBox.width,
    height: boundingBox.height,
  })
  rectangle.data = {
    rawDiagramElementSpec: bgSpecs,
  }
  rectangle.parent = parent
  attachListenersToBackground(rectangle)
  parent.children?.push(rectangle)
  return rectangle
}

const createText = (
  data: C4BaseComponentData,
  elementSpec: DiagramElementSpec | undefined,
  autoLayout: Record<string, ElementData>,
  line: fabric.Polyline | fabric.Path,
  dots: fabric.Object[],
  parent: C4RelationshipComponent,
  renderElementsOptions: RenderElementsOptions | undefined,
  customTagsStyle: AddElementTag | undefined,
): fabric.Group => {
  let textElementSpec
  let scaleX = 1,
    scaleY = 1
  if (elementSpec?.shapes) {
    textElementSpec = elementSpec.shapes.filter(
      (shape) => shape.shape_type === RelObjects.Text,
    )[0] as Shape
    if (textElementSpec) {
      scaleX = textElementSpec.size?.scale_x ?? 1
      scaleY = textElementSpec.size?.scale_y ?? 1
    }
  }
  const objects: fabric.Object[] = []
  const textOptions: fabric.TextOptions = {
    fontFamily: ELEMENT.FONT.FAMILY,
    fill:
      customTagsStyle?.font_color ??
      renderElementsOptions?.diagramsThemeSettings?.text_color_relationship ??
      RELATIONSHIP.COLORS.TEXT_COLOR,
  }
  if (data.base_data?.label) {
    const label = new fabric.Text(unescape(data.base_data.label)!, {
      ...textOptions,
      fontSize: RELATIONSHIP.FONT.SIZE_LABEL,
      fontWeight: 'bold',
      textAlign: 'center',
    })
    label.top = data.technology
      ? -(label.height ?? 0)
      : -(label.height ?? 0) / 2
    label.left =
      (line.width ?? 0) / 2 - (label.width ?? 0) / 2 - (dots[0].width ?? 0) / 2
    objects.push(label)
  }

  if (data.technology) {
    const technology = new fabric.Text(`[${data.technology}]`, {
      ...textOptions,
      fontSize: RELATIONSHIP.FONT.SIZE_TECHNOLOGY,
      textAlign: 'center',
    })
    technology.left =
      (line.width ?? 0) / 2 -
      (technology.width ?? 0) / 2 -
      (dots[0].width ?? 0) / 2
    objects.push(technology)
  }

  const text: fabric.Group = new fabric.Group(objects)
  const textBoundingRect = text.getBoundingRect()
  const background = new fabric.Rect({
    top: textBoundingRect.top - RELATIONSHIP.SIZES.PADDING_BACKGROUND,
    left: textBoundingRect.left - RELATIONSHIP.SIZES.PADDING_BACKGROUND,
    width: textBoundingRect.width + RELATIONSHIP.SIZES.PADDING_BACKGROUND * 2,
    height: textBoundingRect.height + RELATIONSHIP.SIZES.PADDING_BACKGROUND * 2,
    fill:
      renderElementsOptions?.diagramsThemeSettings?.bg_color_relationship ??
      RELATIONSHIP.COLORS.BG_COLOR,
  })

  let left, top
  if (
    elementSpec?.alias &&
    autoLayout[elementSpec.alias] &&
    autoLayout[elementSpec.alias].label_position
  ) {
    left =
      autoLayout[elementSpec.alias].label_position!.x -
      (background.width ?? 0) / 2
    top =
      autoLayout[elementSpec.alias].label_position!.y -
      (background.height ?? 0) / 2
  } else {
    left =
      (line.left ?? 0) + (line.width ?? 0) / 2 - (background.width ?? 0) / 2
    top =
      (line.top ?? 0) + (line.height ?? 0) / 2 - (background.height ?? 0) / 2
  }
  const group = new fabric.Group([background, text], {
    name: RelObjects.Text,
    hasControls: false,
    left,
    top,
    scaleX,
    scaleY,
  })
  group.data = {
    rawDiagramElementSpec: textElementSpec,
  }
  group.parent = parent
  parent.children?.push(group)

  if (textElementSpec) {
    if (
      textElementSpec.position?.left !== undefined &&
      textElementSpec.position?.top !== undefined
    ) {
      group.setPositionByOrigin(
        new fabric.Point(
          textElementSpec.position.left,
          textElementSpec.position.top,
        ),
        'center',
        'center',
      )
    }
  }

  return group
}

// --------------- LISTENERS
const onRelationshipSelected = (
  event: fabric.IEvent<Event>,
  object: fabric.Object,
) => {
  if (event.e && object.parent?.children) {
    const parent = object.parent as C4RelationshipComponent
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
      // Select all the children of the virtual group.
      selection = new VirtualGroupSelection([...(parent.children ?? [])], {
        canvas: object.canvas,
      })
      selection.parent = object.parent
      selection.on(OBJECT_EVENTS.MOUSE_UP, (event) => {
        onRelationshipMouseUp(selection.canvas, event, selection, parent)
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

const attachListenersToLine = (line: fabric.Object) => {
  const parent = line.parent as C4RelationshipComponent
  line.on(OBJECT_EVENTS.SELECTED, (e) => {
    onRelationshipSelected(e, line)
  })
  line.on(OBJECT_EVENTS.MOUSE_UP, (event) => {
    onRelationshipMouseUp(line.canvas, event, line, parent)
  })
}

const attachListenersToBackground = (background: fabric.Object) => {
  const parent = background.parent as C4RelationshipComponent
  background.on(OBJECT_EVENTS.SELECTED, (e) => {
    onRelationshipSelected(e, background)
  })
  background.on(OBJECT_EVENTS.MOUSE_UP, (event) => {
    onRelationshipMouseUp(background.canvas, event, background, parent)
  })
}

const attachListenersToDot = (dot: fabric.Object) => {
  const parent = dot.parent as C4RelationshipComponent
  dot.on(OBJECT_EVENTS.MOVING, (event) => {
    onDotMoving(event)
  })
  dot.on(OBJECT_EVENTS.MOUSE_UP, (event) => {
    onRelationshipMouseUp(dot.canvas, event, dot, parent)
  })
}

const onDotMoving = (event: IEvent<Event>) => {
  if (event.transform?.target) {
    const parent = event.transform.target.parent as C4RelationshipComponent
    if (parent) {
      const line: fabric.Polyline = parent.children?.filter(
        (child) => child.name === RelObjects.Line,
      )[0] as fabric.Polyline
      if (line) {
        updateLinePoints(line)
      }
    }
  }
}

const createContextMenuItems = (
  canvas: fabric.Canvas,
  event: IEvent<Event>,
  selectedObject: fabric.Object,
): DropdownMenuItemProps[] => {
  if (selectedObject instanceof fabric.ActiveSelection) {
    const subMenuItems = []
    if (!(canvas as KeadexCanvas).isReadOnly()) {
      subMenuItems.push(
        {
          isHeaderMenuItem: false,
          id: 'addPoint',
          label: 'Add point',
          onClick: () => {
            addNewPointToLine(selectedObject, event)
          },
        },
        {
          id: 'separatorRel',
          isSepator: true,
        },
        ...createBaseContextMenuItems(canvas, event, selectedObject, false),
      )
    } else if ((canvas as KeadexCanvas).codingFeaturesEnabled) {
      subMenuItems.push(
        ...createBaseContextMenuItems(canvas, event, selectedObject, false),
      )
    }
    return [
      {
        isHeaderMenuItem: true,
        id: 'relationshipContextMenu',
        label: '',
        hidden: true,
        alwaysOpen: true,
        subMenuItems,
      },
    ]
  } else if (selectedObject.name === RelObjects.Dot) {
    if (!(canvas as KeadexCanvas).isReadOnly()) {
      return [
        {
          isHeaderMenuItem: true,
          id: 'dotContextMenu',
          label: '',
          hidden: true,
          alwaysOpen: true,
          subMenuItems: [
            {
              isHeaderMenuItem: false,
              id: 'removePoint',
              label: 'Remove point',
              onClick: () => {
                removeExistingPointFromLine(selectedObject as fabric.Circle)
              },
            },
          ],
        },
      ]
    }
  }
  return []
}

const onRelationshipMouseUp = (
  canvas: fabric.Canvas | undefined,
  event: IEvent<Event>,
  selectedObject: fabric.Object,
  parent: C4RelationshipComponent,
) => {
  if (
    selectedObject.name === RelObjects.Line ||
    selectedObject.name === RelObjects.Rectangle
  )
    return

  if (canvas)
    parent.onComponentMouseUp(
      canvas,
      event,
      selectedObject,
      createContextMenuItems(canvas, event, selectedObject),
    )
}

export default C4Relationship
