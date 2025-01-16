import { render } from '@testing-library/react'

import ModalCRUSoftwareSystem from './ModalCRUSoftwareSystem'

describe('ModalCRUSoftwareSystem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCRUSoftwareSystem
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
