import { render } from '@testing-library/react'

import ModalCRURelationship from './ModalCRURelationship'

describe('ModalCRURelationship', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCRURelationship
        enableEdit={true}
        hideModal={() => {
          console.log('test')
        }}
        forceUpdate={() => {
          console.log('test')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
