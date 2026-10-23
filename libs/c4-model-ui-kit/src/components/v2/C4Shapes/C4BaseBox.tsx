'use client'

import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { unescape } from '@keadex/keadex-utils'
import type { NodeProps } from '@xyflow/react'

import { getCustomTagsStyle, parseTags } from '../../../helper/tags-helper'
import { BOX, ELEMENT } from '../../../styles/style-constants'
import {
  C4BaseNodeData,
  C4BaseNodeRenderingOptions,
  withC4BaseNode,
} from '../C4BaseNode/C4BaseNode'
import { C4Node } from '../C4DiagramCanvas/C4DiagramCanvas'

export interface C4BaseBoxNodeRenderingOptions
  extends C4BaseNodeRenderingOptions {
  widthBox?: number
  widthDescription?: number
  borderRadius?: number
}

function C4BaseBoxComponent<T extends C4BaseNodeData>(
  node: NodeProps<C4Node<T, string>>,
) {
  const { diagramElementData, renderElementsOptions, renderingOptions } =
    node.data
  const baseBoxRenderingOptions =
    renderingOptions as C4BaseBoxNodeRenderingOptions
  const scaledWidth =
    node.width && node.width !== 0
      ? node.width
      : baseBoxRenderingOptions?.widthBox &&
          baseBoxRenderingOptions?.widthBox !== 0
        ? baseBoxRenderingOptions?.widthBox
        : BOX.SIZES.WIDTH
  const scaledHeight =
    node.height && node.height !== 0 ? node.height : BOX.SIZES.MIN_HEIGHT
  const scaleX = node.data.scaleX ?? 1
  const scaleY = node.data.scaleY ?? 1
  const scaledBorderWidth = ELEMENT.SIZES.BORDER_WIDTH * scaleX
  const scaledFontSize = BOX.FONT.SIZE * scaleX
  const scaledFontSizeTag = BOX.FONT.SIZE_TAG * scaleX
  const scaledFontSizeTypeTechnology = BOX.FONT.SIZE_TYPE_TECHNOLOGY * scaleX
  const scaledBorderRadius = BOX.SIZES.BORDER_RADIUS * scaleX

  console.log('C4BaseBoxComponent', {
    scaledWidth,
    scaledHeight,
    scaleX,
    scaleY,
  })
  const customTagsStyle = getCustomTagsStyle(
    parseTags(diagramElementData?.base_data?.tags),
    renderElementsOptions?.tags,
  )

  function renderTags() {
    if (diagramElementData?.base_data?.tags) {
      return (
        <div
          style={{
            color:
              customTagsStyle?.font_color ?? baseBoxRenderingOptions?.textColor,
            fontSize: scaledFontSizeTag,
            marginTop: BOX.SIZES.TOP_TAGS * scaleY,
          }}
          className="w-full text-center font-normal italic"
        >{`«${diagramElementData?.base_data?.tags}»`}</div>
      )
    }
    return null
  }

  function renderLabel() {
    return (
      <div
        style={{
          color:
            customTagsStyle?.font_color ?? baseBoxRenderingOptions?.textColor,
          fontSize: scaledFontSize,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop:
            BOX.SIZES.TOP_LABEL * scaleY -
            (diagramElementData?.base_data?.tags ? scaledFontSizeTag : 0),
        }}
        className="w-full"
      >
        {diagramElementData?.base_data?.label
          ? unescape(diagramElementData?.base_data?.label)
          : 'undefined'}
      </div>
    )
  }

  function renderTypeTechnology() {
    const text = `[${
      diagramElementData?.boundary_custom_type ??
      diagramElementData?.boundary_type ??
      diagramElementData?.component_type ??
      diagramElementData?.container_type ??
      diagramElementData?.deployment_node_type ??
      diagramElementData?.deploymeny_node_custom_type ??
      diagramElementData?.person_type ??
      diagramElementData?.system_type
    }${diagramElementData?.technology ? `: ${diagramElementData?.technology}` : ''}]`
    return (
      <div
        style={{
          color:
            customTagsStyle?.font_color ?? baseBoxRenderingOptions?.textColor,
          fontSize: scaledFontSizeTypeTechnology,
          fontWeight: 'normal',
          textAlign: 'center',
          marginTop: BOX.SIZES.TOP_TYPE_TECHNOLOGY * scaleY,
        }}
        className="w-full"
      >
        {text}
      </div>
    )
  }

  function renderDescription() {
    const width = baseBoxRenderingOptions?.widthDescription ?? scaledWidth
    return (
      <div
        style={{
          color:
            customTagsStyle?.font_color ?? baseBoxRenderingOptions?.textColor,
          fontSize: BOX.FONT.SIZE_DESCRIPTION * scaleX,
          fontWeight: 400,
          opacity: 0.7,
          textAlign: 'center',
          paddingLeft: width ? BOX.SIZES.PADDING_Y_DESCRIPTION / 2 : 0,
          paddingRight: width ? BOX.SIZES.PADDING_Y_DESCRIPTION / 2 : 0,
          marginTop:
            BOX.SIZES.TOP_DESCRIPTION * scaleY - scaledFontSizeTypeTechnology,
          lineBreak: 'anywhere',
        }}
        className="w-full leading-[1.2]"
      >
        {diagramElementData?.base_data?.description
          ? unescape(diagramElementData?.base_data?.description)
          : ''}
      </div>
    )
  }

  function renderLinkIcon() {
    if (diagramElementData?.base_data?.link) {
      return (
        <div
          style={{
            color:
              customTagsStyle?.font_color ?? baseBoxRenderingOptions?.textColor,
            fontSize: BOX.FONT.SIZE_LINK_ICON * scaleX,
            top: BOX.SIZES.TOP_LINK_ICON * scaleY,
            left: BOX.SIZES.LEFT_LINK_ICON * scaleX,
          }}
          className="absolute"
        >
          <FontAwesomeIcon icon={faLink} />
        </div>
      )
    }
    return null
  }

  function renderBox() {
    const tags = renderTags()
    const label = renderLabel()
    const typeTechnology = renderTypeTechnology()
    const description = renderDescription()
    const linkIcon = renderLinkIcon()
    return (
      <div
        style={{
          background: `${customTagsStyle?.bg_color ?? baseBoxRenderingOptions?.bgColor}`,
          borderColor: `${customTagsStyle?.border_color ?? baseBoxRenderingOptions?.borderColor}`,
          borderWidth: scaledBorderWidth,
          left: ELEMENT.SIZES.DEFAULT_LEFT,
          top: ELEMENT.SIZES.DEFAULT_TOP,
          borderRadius:
            baseBoxRenderingOptions?.borderRadius ?? scaledBorderRadius,
          paddingBottom: BOX.SIZES.PADDING_BOTTOM * scaleY,
        }}
        className={`flex flex-col grow w-full h-full`}
      >
        {tags}
        {label}
        {typeTechnology}
        {description}
        {linkIcon}
      </div>
    )
  }

  return (
    <div
      className="flex flex-col leading-none"
      style={{
        width:
          baseBoxRenderingOptions?.widthBox ?? scaledWidth ?? BOX.SIZES.WIDTH,
        minHeight: scaledHeight ?? BOX.SIZES.MIN_HEIGHT,
      }}
    >
      {renderBox()}
    </div>
  )
}

export const C4BaseBox = withC4BaseNode(C4BaseBoxComponent)
