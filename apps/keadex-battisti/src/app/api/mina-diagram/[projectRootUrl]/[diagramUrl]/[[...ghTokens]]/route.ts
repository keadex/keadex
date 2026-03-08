import * as fs from 'fs'
import { NextRequest } from 'next/server'
import { join } from 'path'

import { renderDiagram } from '../../../../../../core/api/mina'

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

  return renderDiagram(projectDiagram)
}
