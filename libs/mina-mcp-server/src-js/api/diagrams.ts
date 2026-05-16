import {
  Diagram,
  DiagramListener,
  DiagramRenderer,
  DiagramsThemeSettings,
} from '@keadex/c4-model-ui-kit'
import { KeadexCanvas } from '@keadex/keadex-ui-kit/components/cross/Canvas/KeadexCanvas'
import { Resvg } from '@resvg/resvg-js'
import { registerFont } from 'canvas'
import { fabric } from 'fabric'
import { join } from 'path'

export type RenderMinaDiagramRequest = {
  diagram: Diagram
  diagramsThemeSettings?: DiagramsThemeSettings
}

export async function renderDiagram(
  request: RenderMinaDiagramRequest,
  format: 'svg' | 'png' = 'png',
): Promise<string | Uint8Array | undefined> {
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
          const objBounds = obj.getBoundingRect(true, true)
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

      if (
        bounds.left === Infinity ||
        bounds.top === Infinity ||
        bounds.right === -Infinity ||
        bounds.bottom === -Infinity
      ) {
        bounds = { left: 0, top: 0, right: 800, bottom: 600 }
      }
    }
    const backgroundColor = '#ffffff'
    const contentWidth = bounds.right - bounds.left
    const contentHeight = bounds.bottom - bounds.top
    const padding = 20
    const width = contentWidth > 0 ? contentWidth + padding * 2 : 800
    const height = contentHeight > 0 ? contentHeight + padding * 2 : 600

    // Move all objects so that the content starts at (padding,padding)
    objects.forEach((obj) => {
      obj.set({
        left: (obj.left ?? 0) - bounds.left + padding,
        top: (obj.top ?? 0) - bounds.top + padding,
      })
      obj.setCoords()
    })

    canvas.setWidth(width)
    canvas.setHeight(height)
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0]
    canvas.calcOffset()
    canvas.backgroundColor = backgroundColor
    canvas.renderAll()

    // Export as SVG
    let svg = canvas.toSVG({
      width,
      height,
      suppressPreamble: true,
    })

    // Set background color for SVG
    svg = svg.replace(
      '<svg ',
      `<svg style='background-color: ${backgroundColor}' `,
    )

    if (format === 'png') {
      const resvg = new Resvg(svg, {
        background: 'rgba(255, 255, 255, 1)',
        fitTo: {
          mode: 'width',
          value: canvas.getWidth(),
        },
      })
      const pngData = resvg.render()
      const pngBuffer = pngData.asPng()
      const encodedPng = pngBuffer.toString('base64')
      return encodedPng
    }

    return svg
  }
  return
}

function registerFonts() {
  const fonts = [
    join(__dirname, 'fonts/Roboto-Bold.ttf'),
    join(__dirname, 'fonts/Roboto-Italic.ttf'),
    join(__dirname, 'fonts/Roboto-Regular.ttf'),
  ]

  fonts.forEach((file) => {
    registerFont(file, {
      family: 'Roboto',
    })
  })
}
