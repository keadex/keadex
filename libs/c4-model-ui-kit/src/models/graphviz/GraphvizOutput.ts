import { GraphvizEdge } from './GraphvizEdge'
import { GraphvizObject } from './GraphvizObject'

export type GraphvizOutput = {
  bb: string
  edges?: GraphvizEdge[]
  objects?: GraphvizObject[]
}
