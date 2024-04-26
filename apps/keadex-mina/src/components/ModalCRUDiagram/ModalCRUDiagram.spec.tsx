import { render } from '@testing-library/react'

import ModalCRUDiagram from './ModalCRUDiagram'

describe('ModalCRUDiagram', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCRUDiagram
        mode={'create'}
        hideModal={function (): void {
          console.log('Function not implemented.')
        }}
        forceUpdate={function (): void {
          console.log('Function not implemented.')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
