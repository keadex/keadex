import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Project } from '../../../models/autogenerated/Project'

type SliceState = { value: Project | undefined }

const initialState: SliceState = { value: undefined }

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    openProject: (state, action: PayloadAction<Project>) => {
      state.value = action.payload
    },
    saveProject: (state, action: PayloadAction<Project>) => {
      state.value = action.payload
    },
    closeProject: (state) => {
      state.value = undefined
    },
  },
})

// Action creators are generated for each case reducer function
export const { openProject, saveProject, closeProject } = projectSlice.actions

export default projectSlice.reducer
