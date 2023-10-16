import { render } from '@testing-library/react'
import Input from './Input'

describe('Input', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Input label="label" />)
    expect(baseElement).toBeTruthy()
  })
})
