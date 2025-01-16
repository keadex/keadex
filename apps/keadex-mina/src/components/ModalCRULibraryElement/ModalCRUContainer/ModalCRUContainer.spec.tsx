import { render } from '@testing-library/react'

import ModalCRUContainer from './ModalCRUContainer'

describe('ModalCRUContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCRUContainer
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
