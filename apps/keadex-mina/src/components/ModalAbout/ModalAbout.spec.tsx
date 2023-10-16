import { render } from '@testing-library/react'

import ModalAbout from './ModalAbout'

describe('ModalAbout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ModalAbout />)
    expect(baseElement).toBeTruthy()
  })
})
