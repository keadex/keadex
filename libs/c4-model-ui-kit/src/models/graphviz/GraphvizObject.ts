import { GraphvizDraw } from './GraphvizDraw'

export type GraphvizObject = {
  name: string
  width?: string // inch
  height?: string // inch
  label?: string
  peripheries?: string
  cluster?: boolean
  subgraphs?: number[]
  _draw_: GraphvizDraw[]
}
