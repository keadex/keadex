import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counter-slice'
import projectReducer from './slices/project-slice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    project: projectReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
