import './styles/index.css'
import pluralize from 'pluralize'

pluralize.addPluralRule(/Person/, 'Persons')

export type { Route, Routes } from './core/routing'
export { findRoute } from './core/routing'

export type Size = 'sm' | 'md' | 'lg' | 'full'

export { useForceUpdate } from './hooks/useForceUpdate/useForceUpdate'
export { useSafeExit } from './hooks/useSafeExit/useSafeExit'
export { createEventContext } from './context/EventContext'
export { faSearchAndReplace } from './assets/icons'
