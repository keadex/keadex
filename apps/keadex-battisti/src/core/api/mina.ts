import {
  Diagram,
  DiagramListener,
  DiagramRenderer,
  DiagramsThemeSettings,
} from '@keadex/c4-model-ui-kit'
import { KeadexCanvas } from '@keadex/keadex-ui-kit/components/cross/Canvas/KeadexCanvas'
import { KEADEX_HEADERS } from '@keadex/keadex-utils/api'
import { Resvg } from '@resvg/resvg-js'
import { registerFont } from 'canvas'
import { fabric } from 'fabric'
import { join } from 'path'

export type RenderMinaDiagramRequest = {
  diagram: Diagram
  diagramsThemeSettings?: DiagramsThemeSettings
}

export async function renderDiagram(
  headers: Headers,
  request?: RenderMinaDiagramRequest,
): Promise<Response> {
  let outputFormat = headers.get(KEADEX_HEADERS.MINA_DIAGRAM_FORMAT) as
    | 'svg'
    | 'png'
    | null
  if (!outputFormat) {
    outputFormat = 'svg'
  }

  const diagramRenderer = new DiagramRenderer()
  await diagramRenderer.initialize()

  const listener: DiagramListener = {
    onOpenDiagramClick: (link) => {
      //
    },
    onOpenExternalLinkClick: (externalLink: string) => {
      //
    },
  }

  if (request && request.diagram) {
    if (request.diagram.diagram_spec?.grid_enabled) {
      // Always disable grid for SSR rendering
      request.diagram.diagram_spec.grid_enabled = false
    }
    const canvas = new KeadexCanvas(null)
    registerFonts()
    diagramRenderer.renderDiagram(
      canvas,
      listener,
      request.diagram,
      request.diagramsThemeSettings,
    )

    // Set canvas size to fit content
    const objects = canvas.getObjects()
    let bounds
    if (objects.length === 0) {
      bounds = { left: 0, top: 0, right: 800, bottom: 600 }
    } else {
      bounds = objects.reduce(
        (acc, obj) => {
          const objBounds = obj.getBoundingRect()
          if (
            !Number.isNaN(objBounds.left) &&
            !Number.isNaN(objBounds.top) &&
            !Number.isNaN(objBounds.width) &&
            !Number.isNaN(objBounds.height)
          ) {
            acc.left = Math.min(acc.left, objBounds.left)
            acc.top = Math.min(acc.top, objBounds.top)
            acc.right = Math.max(acc.right, objBounds.left + objBounds.width)
            acc.bottom = Math.max(acc.bottom, objBounds.top + objBounds.height)
          }
          return acc
        },
        { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity },
      )
    }
    const backgroundColor = '#ffffff'
    const contentWidth = bounds.right - bounds.left
    const contentHeight = bounds.bottom - bounds.top
    canvas.setWidth(contentWidth > 0 ? contentWidth : 800)
    canvas.setHeight(contentHeight > 0 ? contentHeight : 600)
    canvas.absolutePan(new fabric.Point(bounds.left, bounds.top))
    canvas.backgroundColor = backgroundColor

    // Export as SVG
    let svg = canvas.toSVG({
      width: '100%',
      height: '100%',
      suppressPreamble: true,
    })

    // Set background color for SVG
    svg = svg.replace(
      '<svg ',
      `<svg style='background-color: ${backgroundColor}' `,
    )

    if (outputFormat === 'png') {
      const resvg = new Resvg(svg, {
        background: 'rgba(255, 255, 255, 1)',
        fitTo: {
          mode: 'width',
          value: canvas.getWidth(),
        },
      })
      const pngData = resvg.render()
      const pngBuffer = pngData.asPng()
      return new Response(new Uint8Array(pngBuffer), {
        status: 200,
        headers: { 'Content-Type': 'image/png' },
      })
    }

    return new Response(svg, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' },
    })
  }
  return new Response('Bad Request', {
    status: 400,
  })
}

function registerFonts() {
  const fonts = [
    join(process.cwd(), 'public/fonts/Roboto-Bold.ttf'),
    join(process.cwd(), 'public/fonts/Roboto-Italic.ttf'),
    join(process.cwd(), 'public/fonts/Roboto-Regular.ttf'),
  ]

  fonts.forEach((file) => {
    registerFont(file, {
      family: 'Roboto',
    })
  })
}
