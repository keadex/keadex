import { DiagramListener, DiagramRenderer } from '@keadex/c4-model-ui-kit'
import { KeadexCanvas } from '@keadex/keadex-ui-kit/components/cross/Canvas/KeadexCanvas'
import { fabric } from 'fabric'
import { NextRequest } from 'next/server'
import * as fs from 'fs'
import { join } from 'path'
import { registerFont } from 'canvas'

type BaseRemoteDiagramsParams = {
  projectRootUrl: string
  diagramUrl: string
}

type UrlRemoteDiagramsParams = BaseRemoteDiagramsParams & {
  ghTokens?: string[]
}

type RemoteDiagramsParams = BaseRemoteDiagramsParams & {
  ghToken?: string
}

const decodeParams = (params: RemoteDiagramsParams): RemoteDiagramsParams => {
  return {
    projectRootUrl: atob(params.projectRootUrl),
    diagramUrl: atob(params.diagramUrl),
    ghToken: params.ghToken,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<UrlRemoteDiagramsParams> },
) {
  const {
    projectRootUrl: projectRootUrlParam,
    diagramUrl: diagramUrlParam,
    ghTokens: ghTokensParam,
  } = await params

  if (ghTokensParam && ghTokensParam.length > 1) {
    return new Response('Not found', { status: 404 })
  }

  const { projectRootUrl, diagramUrl, ghToken } = decodeParams({
    projectRootUrl: projectRootUrlParam,
    diagramUrl: diagramUrlParam,
    ghToken: ghTokensParam ? ghTokensParam[0] : undefined,
  })

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

  // Patch fs.readFile to handle wasm files from @keadex/mina-react-npm.
  // When deployed on Vercel, the wasm files are not in the same location as in local development.
  const originalReadFile = fs.readFile
  ;(fs as any).readFile = function (
    filePath: fs.PathLike | number,
    maybeCallback?: any,
  ) {
    let patchedPath = filePath
    if (
      typeof filePath !== 'number' &&
      filePath instanceof URL &&
      filePath.toString().includes('@keadex/mina-react-npm') &&
      filePath.toString().endsWith('.wasm')
    ) {
      const pathURL = filePath as URL
      const wasmFileName = pathURL.pathname.substring(
        pathURL.pathname.lastIndexOf('/') + 1,
      )

      const nodeModule = join(
        process.cwd(),
        '../../node_modules/@keadex/mina-react-npm',
        wasmFileName,
      )
      patchedPath = nodeModule
    }
    return originalReadFile(patchedPath, maybeCallback)
  }

  const openRemoteProjectDiagram = (await import('@keadex/mina-react-npm/core'))
    .openRemoteProjectDiagram

  // Restore original readFile function after having successfully loaded the wasm file
  ;(fs as any).readFile = originalReadFile

  const projectDiagram = await openRemoteProjectDiagram(
    projectRootUrl,
    diagramUrl,
    ghToken,
  )
  if (projectDiagram) {
    if (projectDiagram.diagram.diagram_spec?.grid_enabled) {
      // Always disable grid for SSR rendering
      projectDiagram.diagram.diagram_spec.grid_enabled = false
    }
    const canvas = new KeadexCanvas(null)
    registerFonts()
    diagramRenderer.renderDiagram(
      canvas,
      listener,
      projectDiagram.diagram,
      projectDiagram.diagramsThemeSettings,
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
