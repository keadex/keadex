import { GraphvizDraw } from './GraphvizDraw'

export type GraphvizEdge = {
  name: string
  tail: number
  head: number
  pos: string
  _draw_: GraphvizDraw[]
  _hdraw_: GraphvizDraw[]
  _ldraw_: GraphvizDraw[]
}
