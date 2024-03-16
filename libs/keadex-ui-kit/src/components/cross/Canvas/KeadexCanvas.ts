import { fabric } from 'fabric'
import { MOUSE_EVENTS } from '../../../constants/events'

const STATE_IDLE = 'idle'
const STATE_PANNING = 'panning'
const DELTA_ZOOM = 1.1
const DELTA_PAN = 5

export type KeadexCanvasOptions = fabric.ICanvasOptions & {
  readOnly?: boolean
  enableSnapToGrid?: boolean
  gridSize?: number
}

export class KeadexCanvas extends fabric.Canvas {
  constructor(
    element: HTMLCanvasElement | string | null,
    options?: KeadexCanvasOptions,
  ) {
    super(element, options)
    setCanvasZoom(this)
    setCanvasPanning(this)
  }

  override initialize(
    element: HTMLCanvasElement | string | null,
    options?: KeadexCanvasOptions,
  ): fabric.Canvas {
    setCanvasZoom(this)
    setCanvasPanning(this)
    if (options?.readOnly === true) {
      this.setReadOnly()
    }
    if (options?.enableSnapToGrid === true) {
      enableSnapToGrid(this, options.gridSize)
    }
    return super.initialize(element, options)
  }

  isReadOnly() {
    return (
      !fabric.Object.prototype.selectable &&
      fabric.Object.prototype.lockMovementX &&
      fabric.Object.prototype.lockMovementY &&
      fabric.Object.prototype.lockRotation &&
      fabric.Object.prototype.lockScalingFlip &&
      fabric.Object.prototype.lockScalingX &&
      fabric.Object.prototype.lockScalingY &&
      fabric.Object.prototype.lockSkewingX &&
      fabric.Object.prototype.lockSkewingY
    )
  }

  setReadOnly() {
    fabric.Object.prototype.selectable = false
    fabric.Object.prototype.lockMovementX = true
    fabric.Object.prototype.lockMovementY = true
    fabric.Object.prototype.lockRotation = true
    fabric.Object.prototype.lockScalingFlip = true
    fabric.Object.prototype.lockScalingX = true
    fabric.Object.prototype.lockScalingY = true
    fabric.Object.prototype.lockSkewingX = true
    fabric.Object.prototype.lockSkewingY = true
  }

  zoomIn() {
    this.setZoom(this.getZoom() * DELTA_ZOOM)
  }

  zoomOut() {
    this.setZoom(this.getZoom() / DELTA_ZOOM)
  }

  panLeft() {
    this.relativePan(new fabric.Point(DELTA_PAN, 0))
  }

  panRight() {
    this.relativePan(new fabric.Point(-DELTA_PAN, 0))
  }

  panUp() {
    this.relativePan(new fabric.Point(0, DELTA_PAN))
  }

  panDown() {
    this.relativePan(new fabric.Point(0, -DELTA_PAN))
  }
}

function isButtonForPanning(event: fabric.IEvent<MouseEvent>) {
  return event.button === MOUSE_EVENTS.RIGHT_CLICK
}

function setCanvasZoom(canvas: fabric.Canvas) {
  canvas.on('mouse:wheel', function (opt) {
    const delta = opt.e.deltaY
    let zoom = canvas.getZoom()
    zoom *= 0.999 ** delta
    if (zoom > 20) zoom = 20
    if (zoom < 0.01) zoom = 0.01
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom)
    opt.e.preventDefault()
    opt.e.stopPropagation()
  })
}

function setCanvasPanning(canvas: fabric.Canvas) {
  // Remember the previous X and Y coordinates for delta calculations
  let lastClientX: number | undefined
  let lastClientY: number | undefined
  // Keep track of the state
  let state = STATE_IDLE

  // Discard any active object
  canvas.discardActiveObject()

  // When MouseUp fires, we set the state to idle
  canvas.on('mouse:up', function (e) {
    if (isButtonForPanning(e)) {
      state = STATE_IDLE
      canvas.defaultCursor = 'default'
    }
  })
  // When MouseDown fires, we set the state to panning
  canvas.on('mouse:down', (e) => {
    if (isButtonForPanning(e)) {
      canvas.defaultCursor = 'move'
      state = STATE_PANNING
      lastClientX = e.e.clientX
      lastClientY = e.e.clientY
    }
  })
  // When the mouse moves, and we're panning (mouse down), we continue
  canvas.on('mouse:move', (e) => {
    if (state === STATE_PANNING && e && e.e) {
      // Calculate deltas
      let deltaX = 0
      let deltaY = 0
      if (lastClientX) {
        deltaX = e.e.clientX - lastClientX
      }
      if (lastClientY) {
        deltaY = e.e.clientY - lastClientY
      }
      // Update the last X and Y values
      lastClientX = e.e.clientX
      lastClientY = e.e.clientY

      const delta = new fabric.Point(deltaX, deltaY)
      canvas.relativePan(delta)
      canvas.fire('moved')
    }
  })
}

function enableSnapToGrid(canvas: fabric.Canvas, gridSize?: number) {
  const _gridSize = gridSize ?? 5
  canvas.on('object:moving', (options) => {
    options.target?.set({
      left: Math.round((options.target.left ?? 0) / _gridSize) * _gridSize,
      top: Math.round((options.target.top ?? 0) / _gridSize) * _gridSize,
    })
  })
}
