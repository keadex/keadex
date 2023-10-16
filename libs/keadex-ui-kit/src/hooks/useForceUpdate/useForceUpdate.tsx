import { useState } from 'react'

export function useForceUpdate() {
  const [value, setValue] = useState(0)
  return {
    forceUpdate: () => setValue((value) => value + 1),
    updatedCounter: value,
  }
}
