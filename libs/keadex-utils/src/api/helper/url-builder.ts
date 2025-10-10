export function urlBuilder(path: string, variables?: Record<string, string>) {
  const baseUrl =
    process.env['NODE_ENV'] === 'production'
      ? 'https://keadex.dev'
      : 'https://localhost:4200'
  return `${baseUrl}${pathBuilder(path, variables)}`
}

export function pathBuilder(path: string, variables?: Record<string, string>) {
  let fullPath = path.toString()
  Object.keys(variables ?? {}).forEach((key) => {
    fullPath = path.replace(`{${key}}`, variables?.[key] ?? '')
  })
  return fullPath
}
