import { render } from '@testing-library/react'
import Textarea from './Textarea'

describe('Textarea', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Textarea label="label" />)
    expect(baseElement).toBeTruthy()
  })
})
