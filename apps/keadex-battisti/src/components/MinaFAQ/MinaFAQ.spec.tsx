import { render } from '@testing-library/react'

import MinaFAQ from './MinaFAQ'

describe('MinaFAQ', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaFAQ lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
