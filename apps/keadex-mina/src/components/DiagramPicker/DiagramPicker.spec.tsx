import { render } from '@testing-library/react'

import DiagramPicker from './DiagramPicker'

describe('DiagramPicker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiagramPicker />)
    expect(baseElement).toBeTruthy()
  })
})
