export function pxToInch(px: number, dpi = 96): number {
  return Number.parseFloat((px / dpi).toFixed(2))
}

export function inchToPx(inch: number, dpi = 96): number {
  return Number.parseFloat((inch * dpi).toFixed(2))
}

export function pxToPt(px: number): number {
  return Number.parseFloat((px * 0.75).toFixed(2))
}

export function ptToPx(pt: number, dpi = 96): number {
  return Number.parseFloat((pt * (dpi / 72)).toFixed(2))
}
