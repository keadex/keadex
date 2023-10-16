import { render } from '@testing-library/react'

import DiagramCodeView from './DiagramCodeView'

describe('DiagramCodeView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiagramCodeView />)
    expect(baseElement).toBeTruthy()
  })
})
