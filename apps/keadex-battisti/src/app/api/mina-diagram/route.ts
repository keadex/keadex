import { NextRequest } from 'next/server'

import { renderDiagram, RenderMinaDiagramRequest } from '../../../core/api/mina'

export async function POST(nextRequest: NextRequest) {
  const request = (await nextRequest.json()) as RenderMinaDiagramRequest
  return renderDiagram(request)
}
