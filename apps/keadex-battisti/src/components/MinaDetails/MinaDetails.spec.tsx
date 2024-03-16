import { render } from '@testing-library/react'

import MinaDetails from './MinaDetails'

describe('MinaDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaDetails lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
