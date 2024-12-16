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
