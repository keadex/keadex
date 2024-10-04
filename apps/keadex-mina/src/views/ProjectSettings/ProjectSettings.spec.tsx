import { render } from '@testing-library/react'

import ProjectSettings from './ProjectSettings'

describe('ProjectSettings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProjectSettings mode="create" />)
    expect(baseElement).toBeTruthy()
  })
})
