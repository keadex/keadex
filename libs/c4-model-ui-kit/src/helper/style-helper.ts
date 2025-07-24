import { SUPPORTED_BORDER_STYLES } from '../styles/style-constants'

export function getSupportedBorderStyle(borderStyle: string | undefined) {
  if (borderStyle) {
    return SUPPORTED_BORDER_STYLES[borderStyle]
  }
  return
}
