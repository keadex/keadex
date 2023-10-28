import { Keys, useHotkeys } from 'react-hotkeys-hook'
import { Key } from 'ts-key-enum'

export function useDisableBrowserShortcuts() {
  const keys: Keys = [
    `/`,
    `\``,
    `${Key.F3}`,
    `${Key.F4}`,
    `${Key.F5}`,
    `${Key.F10}`,
    `${Key.F10}+${Key.Enter}`,
    `${Key.Alt}+D`,
    `${Key.Alt}+F`,
    `${Key.Alt}+${Key.F4}`,
    `${Key.Alt}+${Key.Shift}+B`,
    `${Key.Control}+B`,
    `${Key.Control}+F`,
    `${Key.Control}+G`,
    `${Key.Control}+K`,
    `${Key.Control}+P`,
    `${Key.Control}+U`,
    `${Key.Control}+${Key.F5}`,
    `${Key.Control}+${Key.F6}`,
    `${Key.Control}+${Key.F10}`,
    `${Key.Control}+${Key.Shift}+A`,
    `${Key.Control}+${Key.Shift}+C`,
    `${Key.Control}+${Key.Shift}+E`,
    `${Key.Control}+${Key.Shift}+J`,
    `${Key.Control}+${Key.Shift}+M`,
    `${Key.Control}+${Key.Shift}+N`,
    `${Key.Control}+${Key.Shift}+O`,
    `${Key.Control}+${Key.Shift}+P`,
    `${Key.Control}+${Key.Shift}+Z`,
    `${Key.Control}+${Key.Shift}+${Key.Delete}`,
    `${Key.Control}+${Key.Shift}+${Key.Escape}`,
    `${Key.Shift}+U`,
    `${Key.Shift}+${Key.F3}`,
    `${Key.Shift}+${Key.F4}`,
    `${Key.Shift}+${Key.F5}`,
    `${Key.Shift}+${Key.F7}`,
    `${Key.Shift}+${Key.Escape}`,
    `${Key.Shift}+${Key.Alt}+T`,
    `${Key.Shift}+${Key.Control}+\\`,
    `${Key.Shift}+${Key.Control}+D`,
  ]
  useHotkeys(keys, (e) => {
    e.preventDefault()
  })
}
