import { render } from '@testing-library/react'

import ModalCRUProject from './ModalCRUProject'

describe('ModalCRUProject', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCRUProject
        mode="edit"
        hideModal={() => {
          console.log('test')
        }}
      />
    )
    expect(baseElement).toBeTruthy()
  })
})
