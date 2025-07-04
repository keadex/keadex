import { render } from '@testing-library/react'
import DiagramsThemeTab from './DiagramsThemeTab'
import { ProjectSettings } from '../../models/autogenerated/ProjectSettings'
import { SetStateAction } from 'react'

describe('DiagramsThemeTab', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramsThemeTab
        project={undefined}
        defaultProjectSettings={{
          autosave_enabled: false,
          autosave_interval_seconds: 0,
          description: '',
          name: '',
          root: '',
          version: '',
        }}
        setOpenResetModal={function (
          value: SetStateAction<string | undefined>,
        ): void {
          console.log('test')
        }}
        setNewProjectSettings={function (
          value: SetStateAction<ProjectSettings | undefined>,
        ): void {
          console.log('test')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
