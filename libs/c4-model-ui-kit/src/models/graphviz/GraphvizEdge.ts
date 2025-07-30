import { GraphvizDraw } from './GraphvizDraw'

export type GraphvizEdge = {
  name: string
  tail: number
  head: number
  pos: string
  _draw_: GraphvizDraw[]
  _hdraw_: GraphvizDraw[]
  _ldraw_: GraphvizDraw[]
  keadex_fromissubgraph?: string // Indicates if the edge starts from a subgraph (keadex specific)
  keadex_toissubgraph?: string // Indicates if the edge ends in a subgraph (keadex specific)
}
