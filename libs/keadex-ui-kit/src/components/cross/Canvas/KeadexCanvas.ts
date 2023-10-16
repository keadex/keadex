import { fabric } from 'fabric'
import { MOUSE_EVENTS } from '../../../constants/events'

const STATE_IDLE = 'idle'
const STATE_PANNING = 'panning'
const DELTA_ZOOM = 1.1
const DELTA_PAN = 5

export class KeadexCanvas extends fabric.Canvas {
  constructor(
    element: HTMLCanvasElement | string | null,
    options?: fabric.ICanvasOptions
  ) {
    super(element, options)
    setCanvasZoom(this)
    setCanvasPanning(this)
  }

  override initialize(
    element: HTMLCanvasElement | string | null,
    options?: fabric.ICanvasOptions
  ): fabric.Canvas {
    setCanvasZoom(this)
    setCanvasPanning(this)
    return super.initialize(element, options)
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
