import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import { createContext } from 'react'

export const createEventContext = <T>(initialValue: EventEmitter<T> | null) => {
  return createContext<EventEmitter<T> | null>(initialValue)
}
