import { render } from '@testing-library/react'

import MinaMCP from './MinaMCP'

describe('MinaMCP', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaMCP lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
