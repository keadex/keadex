'use client'

import type { NodeProps } from '@xyflow/react'

import { getCustomTagsStyle, parseTags } from '../../../helper/tags-helper'
import { BOX, ELEMENT } from '../../../styles/style-constants'
import {
  C4BaseNodeData,
  C4BaseNodeRenderingOptions,
  withC4BaseNode,
} from '../C4BaseNode/C4BaseNode'
import { C4Node } from '../C4DiagramCanvas/C4DiagramCanvas'

export type C4SubgraphNodeRenderingOptions = C4BaseNodeRenderingOptions & {}

export enum SubgraphObjects {
  Rectangle = 'RECTANGLE',
  Footer = 'FOOTER',
}

function C4SubgraphComponent<T extends C4BaseNodeData>(
  node: NodeProps<C4Node<T, string>>,
) {
  const {
    diagramElementData,
    renderElementsOptions,
    renderingOptions,
    diagramElementSpec,
    autoLayout,
  } = node.data
  const subgraphRenderingOptions =
    renderingOptions as C4SubgraphNodeRenderingOptions
  const scaledWidth =
    node.width && node.width !== 0 ? node.width : BOX.SIZES.WIDTH
  const scaledHeight =
    node.height && node.height !== 0 ? node.height : BOX.SIZES.MIN_HEIGHT
  const scaleX = node.data.scaleX ?? 1
  const scaleY = node.data.scaleY ?? 1
  const scaledBorderWidth = ELEMENT.SIZES.BORDER_WIDTH * scaleX
  const scaledBorderRadius = BOX.SIZES.BORDER_RADIUS * scaleX

  const customTagsStyle = getCustomTagsStyle(
    parseTags(diagramElementData?.base_data?.tags),
    renderElementsOptions?.tags,
  )

  function renderSubgraph() {
    return (
      <div
        style={{
          background: `${customTagsStyle?.bg_color ?? subgraphRenderingOptions?.bgColor}`,
          borderColor: `${customTagsStyle?.border_color ?? subgraphRenderingOptions?.borderColor}`,
          borderWidth: scaledBorderWidth,
          borderRadius: scaledBorderRadius,
          paddingBottom: BOX.SIZES.PADDING_BOTTOM * scaleY,
        }}
        data-type={SubgraphObjects.Rectangle}
        className={`flex flex-col grow w-full h-full`}
      >
        {/* {tags}
        {label}
        {typeTechnology}
        {description}
        {linkIcon} */}
      </div>
    )
  }

  return (
    <div
      className="flex flex-col leading-none"
      style={{
        width: scaledWidth,
        minHeight: scaledHeight,
      }}
    >
      {renderSubgraph()}
    </div>
  )
}

export const C4Subgraph = withC4BaseNode(C4SubgraphComponent)
