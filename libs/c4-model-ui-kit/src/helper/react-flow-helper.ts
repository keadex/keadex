import { Node as NodeType } from '@xyflow/react'

export function calculateScale(
  initialWidth: number,
  newWidth: number,
  initialHeight?: number,
  newHeight?: number,
): number {
  if (initialHeight === undefined || newHeight === undefined) {
    return newWidth / initialWidth
  }
  const scaleX = newWidth / initialWidth
  const scaleY = newHeight / initialHeight

  // They should be equal if aspect ratio is locked; average guards against float drift
  return (scaleX + scaleY) / 2
}

export function editableNode(
  _editable?: boolean,
): Pick<NodeType, 'draggable' | 'selectable' | 'connectable'> {
  const editable = _editable !== undefined ? _editable : true
  return {
    draggable: editable,
    selectable: editable,
    connectable: editable,
  }
}
