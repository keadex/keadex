import { DropdownMenuItemProps } from '@keadex/keadex-ui-kit/cross'

import { DIAGRAM_LINKS_SEPARATOR } from '../../../constants/diagram-link'
import {
  isExternalLink,
  linkableDiagramElement,
  linkLabelFromExternalLink,
  replaceExternalLinkVariables,
} from '../../../helper/diagram-link-helper'
import {
  C4DiagramCanvasCommands,
  C4Node,
} from '../C4DiagramCanvas/C4DiagramCanvas'
import { C4BaseNodeData } from './C4BaseNode'

export function createBaseContextMenuItems(
  c4DiagramCanvasInstance: C4DiagramCanvasCommands | undefined,
  event: React.MouseEvent,
  _node: C4Node<C4BaseNodeData, undefined>,
  asSubMenu = true,
): DropdownMenuItemProps[] {
  const baseContextMenuItems = []
  const node = _node.parentId
    ? c4DiagramCanvasInstance?.findNodeById(_node.parentId)
    : _node
  const nodeData = node?.data
  const elementType = nodeData?.diagramElementSpec?.element_type
  const diagramLinks = nodeData?.diagramElementData?.base_data?.link?.split(
    DIAGRAM_LINKS_SEPARATOR,
  )
  const isCanvasReadOnly = c4DiagramCanvasInstance?.isReadOnly()
  const codingFeaturesEnabled =
    c4DiagramCanvasInstance?.getCodingFeaturesEnabled()
  const canOpenDiagramLink =
    elementType !== undefined &&
    diagramLinks &&
    diagramLinks.length > 0 &&
    linkableDiagramElement(elementType) !== undefined

  let nodeLevel = 0
  let parentNode = c4DiagramCanvasInstance?.findNodeById(node?.parentId)
  while (parentNode) {
    nodeLevel++
    parentNode = c4DiagramCanvasInstance?.findNodeById(parentNode?.parentId)
  }

  if (canOpenDiagramLink) {
    diagramLinks.forEach((inputDiagramLink, index) => {
      const diagramLink = inputDiagramLink.replace(/ /gi, '')
      if (diagramLink.length > 0) {
        if (!isExternalLink(diagramLink)) {
          baseContextMenuItems.push({
            isHeaderMenuItem: false,
            id: 'openDiagram',
            label: 'Open Diagram',
            onClick: () => {
              c4DiagramCanvasInstance
                ?.getDiagramListener()
                ?.onOpenDiagramClick(diagramLink)
            },
          })
        } else {
          baseContextMenuItems.push({
            isHeaderMenuItem: false,
            id: `openLink${index}`,
            label: linkLabelFromExternalLink(diagramLink),
            onClick: () => {
              c4DiagramCanvasInstance
                ?.getDiagramListener()
                ?.onOpenExternalLinkClick(
                  replaceExternalLinkVariables(
                    diagramLink,
                    nodeData?.diagramElementData,
                  ),
                )
            },
          })
        }
      }
    })
  }
  if (
    codingFeaturesEnabled &&
    nodeData?.diagramElementData &&
    nodeData?.diagramElementSpec?.element_type
  ) {
    baseContextMenuItems.push({
      isHeaderMenuItem: false,
      id: 'selectDiagramElementCode',
      label: 'Select code',
      onClick: () => {
        c4DiagramCanvasInstance
          ?.getDiagramListener()
          ?.onSelectElementCode?.(
            nodeData?.diagramElementData,
            nodeData?.diagramElementSpec?.element_type,
            nodeLevel,
          )
      },
    })
  }

  if (
    !isCanvasReadOnly &&
    (canOpenDiagramLink ||
      (codingFeaturesEnabled &&
        nodeData?.diagramElementData &&
        nodeData?.diagramElementSpec?.element_type))
  ) {
    baseContextMenuItems.push({
      id: 'separatorCommon',
      isSepator: true,
    })
  }

  if (!isCanvasReadOnly) {
    baseContextMenuItems.push(
      {
        isHeaderMenuItem: false,
        id: 'bringToFront',
        label: 'Bring to Front',
        onClick: () => {
          if (node) c4DiagramCanvasInstance?.bringToFront(node.id)
        },
      },
      {
        isHeaderMenuItem: false,
        id: 'bringForward',
        label: 'Bring Forward',
        onClick: () => {
          if (node) c4DiagramCanvasInstance?.bringForward(node.id)
        },
      },
      {
        isHeaderMenuItem: false,
        id: 'sentToBack',
        label: 'Send to Back',
        onClick: () => sendToBack(c4DiagramCanvasInstance, node),
      },
      {
        isHeaderMenuItem: false,
        id: 'sendBackwards',
        label: 'Send Backwards',
        onClick: () => sendBackwards(c4DiagramCanvasInstance, node),
      },
    )
  }

  if (!asSubMenu) return baseContextMenuItems
  else
    return [
      {
        isHeaderMenuItem: true,
        id: 'baseComponentContextMenu',
        label: '',
        hidden: true,
        alwaysOpen: true,
        subMenuItems: baseContextMenuItems,
      },
    ]
}

const sendToBack = (
  c4DiagramCanvasInstance: C4DiagramCanvasCommands | undefined | null,
  node: C4Node<C4BaseNodeData, undefined> | undefined,
) => {
  if (!node?.parentId && node?.id) {
    // Is allowed to send to back an object only when it is not a child
    // of a virtual group, otherwise it will go behind of the parent and
    // it will not be possible to bring again it to front.
    c4DiagramCanvasInstance?.sendToBack(node.id)
  }
}

const sendBackwards = (
  c4DiagramCanvasInstance: C4DiagramCanvasCommands | undefined | null,
  node: C4Node<C4BaseNodeData, undefined> | undefined,
) => {
  const nodeZIndex = node?.zIndex
  const parentNodeZIndex = c4DiagramCanvasInstance?.findNodeById(
    node?.parentId ?? '',
  )?.zIndex

  if (
    node?.id &&
    (parentNodeZIndex === undefined ||
      nodeZIndex === undefined ||
      nodeZIndex - 1 > parentNodeZIndex)
  ) {
    c4DiagramCanvasInstance?.sendBackward(node.id)
  } else {
    console.debug(`cannot send backwards ${nodeZIndex} ${parentNodeZIndex}`)
  }
}
