export function unescape(str?: string) {
  if (str) {
    return str
      .replace(/\\n/g, '\n') // Unescape newline
      .replace(/\\t/g, '    ') // Unescape tab
      .replace(/\\r/g, '\n') // Unescape carriage return
  } else {
    return
  }
}

export function longerString(str: string[]): string {
  const res = str.sort((a, b) => {
    return b.length - a.length
  })
  return res[0]
}
