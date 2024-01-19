import { render } from '@testing-library/react'

import AboutMeSummary from './AboutMeSummary'

describe('AboutMeSummary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AboutMeSummary lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
