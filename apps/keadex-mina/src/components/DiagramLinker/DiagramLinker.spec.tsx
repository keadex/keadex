import { render } from '@testing-library/react'

import DiagramLinker from './DiagramLinker'

describe('DiagramLinker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiagramLinker />)
    expect(baseElement).toBeTruthy()
  })
})
