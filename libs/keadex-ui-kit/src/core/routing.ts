import { WindowTitlebarMenuFactory } from '../desktop'

export interface Routes<T, K> {
  [path: string]: Route<T, K>
}

export interface Route<T, K> {
  path: string
  titlebarMenuFactory?: WindowTitlebarMenuFactory<T, K>
  isAppMenuVisible?: boolean
  protectExit?: boolean
}
