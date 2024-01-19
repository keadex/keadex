import { render } from '@testing-library/react'

import ProjectsSummary from './ProjectsSummary'

describe('ProjectsSummary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProjectsSummary lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
