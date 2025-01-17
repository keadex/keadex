import { render } from '@testing-library/react'

import ModalCRUBoundary from './ModalCRUBoundary'

describe('ModalCRUBoundary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCRUBoundary
        enableEdit={true}
        hideModal={() => {
          console.log('test')
        }}
        forceUpdate={() => {
          console.log('test')
        }}
        diagramAliases={[]}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
