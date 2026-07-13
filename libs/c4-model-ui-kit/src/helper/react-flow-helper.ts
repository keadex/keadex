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
