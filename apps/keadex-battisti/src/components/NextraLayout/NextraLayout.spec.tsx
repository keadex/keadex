import { render } from '@testing-library/react'

import NextraLayout from './NextraLayout'

describe('NextraLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NextraLayout />)
    expect(baseElement).toBeTruthy()
  })
})
