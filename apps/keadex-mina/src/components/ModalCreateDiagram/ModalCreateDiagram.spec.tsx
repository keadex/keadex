import { render } from '@testing-library/react'

import ModalCreateDiagram from './ModalCreateDiagram'

describe('ModalCreateDiagram', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ModalCreateDiagram />)
    expect(baseElement).toBeTruthy()
  })
})
