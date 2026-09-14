export interface Debounced<T extends (...args: any[]) => void> {
  (...args: Parameters<T>): void
  cancel: () => void
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
  immediate?: boolean,
): Debounced<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    if (timeout) clearTimeout(timeout)

    if (immediate && !timeout) func.apply(this, args)

    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }, wait)
  } as Debounced<T>

  debounced.cancel = function () {
    if (timeout) clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
