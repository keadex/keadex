import { render } from '@testing-library/react'

import DiagramEditor from './DiagramEditor'

describe('DiagramEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiagramEditor />)
    expect(baseElement).toBeTruthy()
  })
})
