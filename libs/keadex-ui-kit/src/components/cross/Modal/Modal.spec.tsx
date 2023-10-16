import { render } from '@testing-library/react'
import Modal from './Modal'

describe('Modal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Modal />)
    expect(baseElement).toBeTruthy()
  })
})
