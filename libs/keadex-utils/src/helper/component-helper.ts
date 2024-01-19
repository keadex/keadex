export const getDataAttributes = (inputProps: any = {}) =>
  Object.keys(inputProps).reduce((acc: any, key: string) => {
    if (key.startsWith('data-')) {
      acc[key] = inputProps[key]
    }

    return acc
  }, {})

export const isCSR = () => {
  return typeof window !== 'undefined'
}
