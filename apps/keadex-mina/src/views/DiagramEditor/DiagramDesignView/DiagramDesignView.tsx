import {
  CANVAS_EVENTS,
  Diagram,
  DiagramListener,
  DiagramSpec,
  ELEMENT,
  getBoundingBox,
  getCanvasPan,
  invalidateCanvasCache,
  renderDiagram,
  updateDiagramElementsSpecsFromCanvas,
} from '@keadex/c4-model-ui-kit'
import { KeadexCanvas, KeadexCanvasOptions } from '@keadex/keadex-ui-kit/cross'
import { objectsAreEqual } from '@keadex/keadex-utils'
import { fabric } from 'fabric'
import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  RefObject,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useResizeDetector } from 'react-resize-detector'
import { toast } from 'react-toastify'
import DiagramDesignViewFloatMenu from '../../../components/DiagramDesignViewFloatMenu/DiagramDesignViewFloatMenu'
import { exportDiagramToFile } from '../../../core/tauri-rust-bridge'
import { MinaError } from '../../../models/autogenerated/MinaError'
import FontFaceObserver from 'fontfaceobserver'
import { DiagramDesignViewToolbarCommands } from '../../../components/DiagramDesignViewToolbar/DiagramDesignViewToolbar'

const MARGIN_EXPORTED_DIAGRAM = 50

export interface KeadexCanvasState {
  zoom: number
  pan: { panX: number; panY: number }
}

export interface DiagramDesignViewProps {
  diagramDesignViewToolbarCommands: RefObject<DiagramDesignViewToolbarCommands>
  diagramListener: DiagramListener
  diagram?: Diagram
  error?: MinaError
  readOnly?: boolean
}

export interface DiagramDesignViewCommands {
  resetCanvas: (canvasState?: KeadexCanvasState) => void
  getUpdatedDiagramSpec: () => DiagramSpec | undefined
  getCanvasState: () => KeadexCanvasState
  exportDiagram: () => void
  isDiagramChanged: () => boolean
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export const DiagramDesignView = forwardRef(
  (props: DiagramDesignViewProps, ref: Ref<DiagramDesignViewCommands>) => {
    const { diagram, diagramListener, diagramDesignViewToolbarCommands } = props

    const { t } = useTranslation()
    const canvas = useRef<KeadexCanvas>()
    const canvasEl = useRef<HTMLCanvasElement>(null)
    const parentDivEl = useRef<HTMLDivElement>(null)
    const { ref: rootDiv } = useResizeDetector()
    const currentRenderedDiagram = useRef<Diagram | null>()
    const isDiagramChanged = useRef<boolean>(false)
    const mouseOnCanvas = useRef<boolean>(false)

    const historyProcessing = useRef<boolean>(false)
    const [historyUndo, setHistoryUndo] = useState<DiagramSpec[]>([])
    const [historyRedo, setHistoryRedo] = useState<DiagramSpec[]>([])

    if (!objectsAreEqual(currentRenderedDiagram.current, diagram)) {
      currentRenderedDiagram.current = diagram
    }

    function canvasModifiedCallback() {
      isDiagramChanged.current = true
      saveHistory()
    }

    function createCanvas(canvasState?: KeadexCanvasState) {
      const options: KeadexCanvasOptions = {
        fireRightClick: true,
        fireMiddleClick: true,
        stopContextMenu: true,
        backgroundColor: 'white',
        readOnly: props.readOnly,
        enableSnapToGrid: true,
      }

      const localCanvas = new KeadexCanvas(canvasEl.current, options)

      localCanvas.on(CANVAS_EVENTS.OBJECT_ADDED, canvasModifiedCallback)
      localCanvas.on(CANVAS_EVENTS.OBJECT_REMOVED, canvasModifiedCallback)
      localCanvas.on(CANVAS_EVENTS.OBJECT_MODIFIED, canvasModifiedCallback)

      localCanvas.on(
        CANVAS_EVENTS.MOUSE_DOWN,
        () => (mouseOnCanvas.current = true),
      )
      localCanvas.on(
        CANVAS_EVENTS.MOUSE_OUT,
        () => (mouseOnCanvas.current = false),
      )

      isDiagramChanged.current = false

      // Reset the state of the canvas (if any)
      if (canvasState) {
        localCanvas.setZoom(canvasState.zoom)
        localCanvas.relativePan(
          new fabric.Point(canvasState.pan.panX, canvasState.pan.panY),
        )
      }
      canvas.current = localCanvas
    }

    function destroyCanvas() {
      if (canvas.current) {
        canvas.current.dispose()
        canvas.current = undefined
      }
    }

    function resetCanvas(canvasState?: KeadexCanvasState) {
      destroyCanvas()
      createCanvas(canvasState)
    }

    function getCanvasState(): KeadexCanvasState {
      return {
        zoom: canvas.current?.getZoom() ?? 1,
        pan: getCanvasPan(canvas.current),
      }
    }

    async function exportDiagram() {
      if (
        currentRenderedDiagram.current?.diagram_name &&
        currentRenderedDiagram.current.diagram_type &&
        canvas.current
      ) {
        const format = 'png' //TODO
        console.debug(`Exporting to ${format}`)

        // Temporary reset the viewport transform in order to ignore zoom and pan
        // in the exported diagram.
        const originalTransform = canvas.current.viewportTransform
        canvas.current.viewportTransform = fabric.iMatrix.slice(0)

        // Calculate the bounding box of all the objects of the canvas in order to
        // export also the objects "outside" the canvas and not visible in the viewport
        let { width, height, left, top } = getBoundingBox(
          canvas.current.getObjects(),
        )
        if (width && height && left && top) {
          width += MARGIN_EXPORTED_DIAGRAM
          height += MARGIN_EXPORTED_DIAGRAM
          left -= MARGIN_EXPORTED_DIAGRAM / 2
          top -= MARGIN_EXPORTED_DIAGRAM / 2
        }

        await exportDiagramToFile(
          currentRenderedDiagram.current.diagram_name,
          currentRenderedDiagram.current.diagram_type,
          canvas.current.toDataURL({
            format,
            enableRetinaScaling: true,
            width,
            height,
            left,
            top,
          }),
          format,
        )
          .then((pathExportedDiagram) =>
            toast.success(
              t('common.info.diagram_exported', { pathExportedDiagram }),
            ),
          )
          .catch((error: MinaError) => toast.success(error.msg))

        // Restore the original viewport transform (with zoom and pan)
        canvas.current.viewportTransform = originalTransform
      }
    }

    function getUpdatedDiagramSpec(): DiagramSpec | undefined {
      if (
        currentRenderedDiagram.current &&
        currentRenderedDiagram.current.diagram_plantuml &&
        currentRenderedDiagram.current.diagram_spec &&
        currentRenderedDiagram.current.diagram_name &&
        currentRenderedDiagram.current.diagram_type
      ) {
        const updatedSpecs = updateDiagramElementsSpecsFromCanvas(
          canvas.current,
        )
        return {
          ...currentRenderedDiagram.current.diagram_spec,
          elements_specs: updatedSpecs,
        }
      }
    }

    function isDiagramChangedFunc(): boolean {
      return isDiagramChanged.current
    }

    //----------------- Start History Implementation
    function initHistory() {
      console.debug('Init history')
      historyProcessing.current = false
      if (currentRenderedDiagram.current?.diagram_spec) {
        setHistoryUndo([currentRenderedDiagram.current.diagram_spec])
      }
      setHistoryRedo([])
    }

    function saveHistory() {
      if (!historyProcessing.current) {
        const updatedSpecs = getUpdatedDiagramSpec()
        if (updatedSpecs) {
          console.debug('Save history')
          setHistoryUndo((prev) => [...prev, updatedSpecs])
        }
      }
    }

    function loadHistory(history: DiagramSpec) {
      console.debug('Load history')
      if (canvas.current) {
        resetCanvas(getCanvasState())
        renderDiagram(canvas.current, diagramListener, {
          ...currentRenderedDiagram.current,
          diagram_spec: history,
        })
        canvas.current.renderAll()
        isDiagramChanged.current = true
      }
      console.debug('Load history completed')
    }

    function undo() {
      historyProcessing.current = true
      // In the stack there should be alway at least 2 elements: the current state, just pushed,
      // due to the modified object, and the previous one that we want to restore
      if (canUndo()) {
        const currentState = historyUndo[historyUndo.length - 1]
        const previousState = historyUndo[historyUndo.length - 2]
        // setHistoryUndo((prev) => prev.slice(0, prev.length - 2))
        if (currentRenderedDiagram.current && currentState && previousState) {
          console.debug('Undo design view')
          // "pop" from the history only the old current state and keep the previous state,
          // which is the new one we're going to restore
          setHistoryUndo((prev) =>
            prev.filter((value, index) => index !== prev.length - 1),
          )
          // "push" the current state to the redo history
          setHistoryRedo((prev) => [...prev, currentState])

          loadHistory(previousState)
        }
      }
      historyProcessing.current = false
    }

    function redo() {
      console.debug('Redo design view')
      historyProcessing.current = true
      if (canRedo()) {
        const nextState = historyRedo[historyRedo.length - 1]
        if (nextState) {
          // "pop"
          setHistoryRedo((prev) =>
            prev.filter((value, index) => index !== prev.length - 1),
          )
          // Re-"push" the next state we're going to restore in the undo history
          // since it is the new current state
          setHistoryUndo((prev) => [...prev, nextState])

          loadHistory(nextState)
        }
      }
      historyProcessing.current = false
    }

    function canUndo(): boolean {
      return historyUndo.length > 1
    }

    function canRedo(): boolean {
      return historyRedo.length > 0
    }
    //----------------- End History Implementation

    useImperativeHandle(ref, () => ({
      resetCanvas,
      getCanvasState,
      exportDiagram,
      getUpdatedDiagramSpec,
      isDiagramChanged: isDiagramChangedFunc,
      undo,
      redo,
      canUndo,
      canRedo,
    }))

    useLayoutEffect(() => {
      console.debug('Diagram Design View changed layout')
      if (
        canvasEl.current &&
        parentDivEl.current?.clientWidth &&
        parentDivEl.current?.clientHeight
      ) {
        console.debug('Canvas resize')
        // Following is needed because if you calculate the new height without hiding
        // the inner canvas, it will have the full height of the div, which is not correct.
        // The real height takes also into account other divs before the canvas one.
        if (canvasEl.current.parentElement)
          canvasEl.current.parentElement.style.display = 'none'
        canvas.current?.setWidth(
          parentDivEl.current?.getBoundingClientRect().width,
        )
        canvas.current?.setHeight(
          parentDivEl.current?.getBoundingClientRect().height,
        )
        if (canvasEl.current.parentElement)
          canvasEl.current.parentElement.style.display = 'flex'
        canvas.current?.renderAll()
      }
    })

    useEffect(() => {
      // Make sure to rerender the canvas after loading the custom font, since
      // it could happen the font is not ready before rendering the canvas.
      // Without rerendering it, the canvas will render only the wrong font.
      const myfont = new FontFaceObserver(ELEMENT.FONT.FAMILY)
      myfont.load(null, 360000).then(function () {
        if (canvas.current) {
          invalidateCanvasCache(canvas.current)
          canvas.current.renderAll()
        }
      })
      if (canvasEl.current && !canvas.current) {
        createCanvas()
      }
      return () => {
        destroyCanvas()
      }
    }, [])

    useEffect(() => {
      function handle(e: KeyboardEvent) {
        if (
          (e.key.toUpperCase() === 'Z' || e.key.toUpperCase() === 'Y') &&
          (e.ctrlKey || e.metaKey) &&
          mouseOnCanvas.current
        ) {
          e.preventDefault()
          if (e.key.toUpperCase() === 'Z') {
            undo()
          } else if (e.key.toUpperCase() === 'Y') {
            redo()
          }
        }
      }
      document.addEventListener('keydown', handle)
      return () => document.removeEventListener('keydown', handle)
    }, [historyUndo, historyRedo])

    useEffect(() => {
      if (canvas.current && currentRenderedDiagram.current) {
        console.debug('Rendering the diagram')
        renderDiagram(
          canvas.current,
          diagramListener,
          currentRenderedDiagram.current,
        )
        canvas.current.renderAll()
        isDiagramChanged.current = false
        if (!historyProcessing.current) initHistory()
      }
    }, [currentRenderedDiagram.current])

    useEffect(() => {
      console.debug('Update design toolbar')
      diagramDesignViewToolbarCommands.current?.forceUpdate()
    }, [historyUndo, historyRedo, diagramDesignViewToolbarCommands])

    return (
      <div className="relative h-full w-full border" ref={rootDiv}>
        <DiagramDesignViewFloatMenu canvas={canvas.current} />
        <div className="h-full w-full flex-row flex-wrap" ref={parentDivEl}>
          <canvas ref={canvasEl} />
        </div>
      </div>
    )
  },
)

export default DiagramDesignView
