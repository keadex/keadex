import { render } from '@testing-library/react'
import MinaLive from './MinaLive'

describe('MinaLive', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaLive />)
    expect(baseElement).toBeTruthy()
  })
})
