import { render } from '@testing-library/react'

import DocsSummary from './DocsSummary'

describe('DocsSummary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DocsSummary lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
