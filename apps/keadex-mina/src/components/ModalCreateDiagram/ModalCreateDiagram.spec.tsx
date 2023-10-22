import { render } from '@testing-library/react'

import ModalCreateDiagram from './ModalCreateDiagram'

describe('ModalCreateDiagram', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCreateDiagram
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
