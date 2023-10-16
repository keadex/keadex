import { render } from '@testing-library/react'

import ProjectPanel from './ProjectPanel'

describe('ProjectPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProjectPanel />)
    expect(baseElement).toBeTruthy()
  })
})
