import { render } from '@testing-library/react'

import ModalCRUPerson from './ModalCRUPerson'

describe('ModalCRUPerson', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCRUPerson
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
