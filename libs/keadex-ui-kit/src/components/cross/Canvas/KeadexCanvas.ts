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
  gridEnabled?: boolean
}

export class KeadexCanvas extends fabric.Canvas {
  private gridEnabled?: boolean
  private gridBgColor?: string | fabric.Pattern | fabric.Gradient

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
    this.gridEnabled = options?.gridEnabled

    setCanvasZoom(this)
    setCanvasPanning(this)
    if (options?.readOnly === true) {
      this.setReadOnly()
    }
    if (options?.gridEnabled === true) {
      this.enableGrid()
    }
    if (options?.enableSnapToGrid === true) {
      enableSnapToGrid(this, options.gridSize)
    }

    return super.initialize(element, options)
  }

  isReadOnly() {
    return (
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
    fabric.Object.prototype.lockMovementX = true
    fabric.Object.prototype.lockMovementY = true
    fabric.Object.prototype.lockRotation = true
    fabric.Object.prototype.lockScalingFlip = true
    fabric.Object.prototype.lockScalingX = true
    fabric.Object.prototype.lockScalingY = true
    fabric.Object.prototype.lockSkewingX = true
    fabric.Object.prototype.lockSkewingY = true
  }

  setReadAndWrite() {
    fabric.Object.prototype.lockMovementX = false
    fabric.Object.prototype.lockMovementY = false
    fabric.Object.prototype.lockRotation = false
    fabric.Object.prototype.lockScalingFlip = false
    fabric.Object.prototype.lockScalingX = false
    fabric.Object.prototype.lockScalingY = false
    fabric.Object.prototype.lockSkewingX = false
    fabric.Object.prototype.lockSkewingY = false
  }

  zoomIn() {
    this.setZoom(this.getZoom() * DELTA_ZOOM)
  }

  zoomOut() {
    this.setZoom(this.getZoom() / DELTA_ZOOM)
  }

  resetZoom() {
    this.setZoom(1)
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

  resetPan() {
    this.absolutePan(new fabric.Point(0, 0))
  }

  isGridEnabled() {
    return this.gridEnabled ?? false
  }

  enableGrid() {
    if (!this.gridEnabled) {
      this.gridEnabled = true
      this.gridBgColor = this.backgroundColor
      const gridSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="160" height="160" fill="${this.gridBgColor}" /><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><rect x="0.38" y="0.38" width="160" height="160" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.75px"/><line x1="0.38" y1="140.38" x2="160.38" y2="140.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="0.38" y1="120.38" x2="160.38" y2="120.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="0.38" y1="100.38" x2="160.38" y2="100.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="0.38" y1="80.38" x2="160.38" y2="80.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.5px"/><line x1="0.38" y1="60.38" x2="160.38" y2="60.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="0.38" y1="40.38" x2="160.38" y2="40.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="0.38" y1="20.38" x2="160.38" y2="20.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="140.38" y1="0.38" x2="140.38" y2="160.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="120.38" y1="0.38" x2="120.38" y2="160.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="100.38" y1="0.38" x2="100.38" y2="160.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="80.38" y1="0.38" x2="80.38" y2="160.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.5px"/><line x1="60.38" y1="0.38" x2="60.38" y2="160.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="40.38" y1="0.38" x2="40.38" y2="160.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/><line x1="20.38" y1="0.38" x2="20.38" y2="160.38" style="fill:none;stroke:#bcbec0;stroke-miterlimit:10;stroke-width:0.25px"/></g></g></svg>
`

      // Create a data URI from the SVG string
      const svgBlob = new Blob([gridSvg], { type: 'image/svg+xml' })
      const svgUrl = URL.createObjectURL(svgBlob)

      fabric.Image.fromURL(svgUrl, (img) => {
        img.scaleToWidth(this.width ?? 0)
        img.scaleToHeight(this.height ?? 0)
        const pattern = new fabric.Pattern({
          source: img.getElement() as HTMLImageElement,
          repeat: 'repeat',
        })
        this.setBackgroundColor(pattern, this.renderAll.bind(this))
      })
    }
  }

  disableGrid() {
    if (this.gridEnabled) {
      this.gridEnabled = false
      if (this.gridBgColor) {
        this.setBackgroundColor(this.gridBgColor, this.renderAll.bind(this))
        this.gridBgColor = undefined
      }
    }
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
