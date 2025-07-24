import { render } from '@testing-library/react'

import ModalCRUAddElementTag from './ModalCRUAddElementTag'

describe('ModalCRUAddElementTag', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCRUAddElementTag
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
