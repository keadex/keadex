import { render } from '@testing-library/react'

import ExternalDiagrams from './ExternalDiagrams'

describe('ExternalDiagrams', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ExternalDiagrams />)
    expect(baseElement).toBeTruthy()
  })
})
