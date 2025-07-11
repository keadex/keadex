import { render } from '@testing-library/react'
import EditorTab from './EditorTab'
import { ProjectSettings } from '../../models/autogenerated/ProjectSettings'
import { SetStateAction } from 'react'

describe('EditorTab', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <EditorTab
        setNewProjectSettings={function (
          value: SetStateAction<ProjectSettings | undefined>,
        ): void {
          console.log('test')
        }}
        autosaveEnabled={false}
        autosaveIntervalSeconds={null}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
