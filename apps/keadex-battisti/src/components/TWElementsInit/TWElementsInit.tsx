'use client'
import { useEffect } from 'react'

export const TWElementsInit = () => {
  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      const { initTE, Button, Collapse, Dropdown, Input, Modal, Select } =
        await import('tw-elements')
      initTE({ Dropdown, Button, Modal, Input, Select, Collapse })
    })()
  }, [])
  return null
}
