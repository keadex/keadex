import { render } from '@testing-library/react'

import LibraryPanel from './LibraryPanel'

describe('LibraryPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LibraryPanel />)
    expect(baseElement).toBeTruthy()
  })
})
