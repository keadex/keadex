import { render } from '@testing-library/react'
import Window from './Window'

describe('IconButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Window />)
    expect(baseElement).toBeTruthy()
  })
})
