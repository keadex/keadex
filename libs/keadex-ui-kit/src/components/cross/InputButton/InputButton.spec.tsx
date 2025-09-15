import { render } from '@testing-library/react'
import InputButton from './InputButton'

describe('InputButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputButton />)
    expect(baseElement).toBeTruthy()
  })
})
