import { render } from '@testing-library/react'

import ModalCRUComponent from './ModalCRUComponent'

describe('ModalCRUComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCRUComponent
        enableEdit={true}
        hideModal={() => {
          console.log('test')
        }}
        forceUpdate={() => {
          console.log('test')
        }}
      />
    )
    expect(baseElement).toBeTruthy()
  })
})
