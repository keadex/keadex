export function roundToDecimalPlaces(num?: number, decimalPlaces = 2) {
  if (num === undefined || num === null) {
    return 0
  }
  const multiplier = Math.pow(10, decimalPlaces)
  return Math.round(num * multiplier) / multiplier
}
