import { render } from '@testing-library/react'

import RemoteDiagrams from './RemoteDiagrams'

describe('RemoteDiagrams', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RemoteDiagrams />)
    expect(baseElement).toBeTruthy()
  })
})
