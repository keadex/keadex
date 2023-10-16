import { render } from '@testing-library/react'

import HomeProject from './HomeProject'

describe('HomeProject', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HomeProject />)
    expect(baseElement).toBeTruthy()
  })
})
