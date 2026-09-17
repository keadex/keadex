import { Node as NodeType, Edge as EdgeType } from '@xyflow/react'

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

export function editableNode<T extends Record<string, unknown>>(
  node: NodeType<T>,
  _editable?: boolean,
): NodeType<T> {
  const editable = _editable !== undefined ? _editable : true // Default to editable if not specified
  // Return a new object with updated properties. In this way, we don't mutate the original object, which is important for React's state management and rendering.
  return {
    ...node,
    draggable: editable,
    selectable: editable,
    connectable: editable,
  }
}

export function readOnlyNode<T extends Record<string, unknown>>(
  node: NodeType<T>,
  readOnly?: boolean,
): NodeType<T> {
  // Default to readOnly false if not specified
  if (readOnly === undefined) readOnly = false
  // Return a new object with updated properties. In this way, we don't mutate the original object, which is important for React's state management and rendering.
  return {
    ...node,
    draggable: !readOnly,
    selectable: !readOnly,
    connectable: !readOnly,
    data: {
      ...node.data,
      readOnly,
    },
  }
}

export function readOnlyEdge<T extends Record<string, unknown>>(
  edge: EdgeType<T>,
  readOnly?: boolean,
): EdgeType<T> {
  // Default to readOnly false if not specified
  if (readOnly === undefined) readOnly = false
  // Return a new object with updated properties. In this way, we don't mutate the original object, which is important for React's state management and rendering.
  return {
    ...edge,
    selectable: !readOnly,
    reconnectable: !readOnly,
  }
}
