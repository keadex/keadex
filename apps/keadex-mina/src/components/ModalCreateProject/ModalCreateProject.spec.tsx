import { render } from '@testing-library/react'

import ModalCreateProject from './ModalCreateProject'

describe('ModalCreateProject', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCreateProject
        mode="edit"
        hideModal={() => {
          console.log('test')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
