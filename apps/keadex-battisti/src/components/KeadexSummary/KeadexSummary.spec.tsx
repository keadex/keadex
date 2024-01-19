import { render } from '@testing-library/react'

import KeadexSummary from './KeadexSummary'

describe('KeadexSummary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<KeadexSummary />)
    expect(baseElement).toBeTruthy()
  })
})
