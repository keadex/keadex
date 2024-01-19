import { render } from '@testing-library/react'

import Footer from './Footer'

describe('Footer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Footer lang="en" />)
    expect(baseElement).toBeTruthy()
  })
})
