import { render } from '@testing-library/react'

import MinaSummary from './MinaSummary'

describe('MinaSummary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaSummary lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
