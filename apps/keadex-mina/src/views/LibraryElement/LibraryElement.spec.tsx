import { render } from '@testing-library/react'

import LibraryElement from './LibraryElement'

describe('LibraryElement', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LibraryElement c4ElementType="Person" />)
    expect(baseElement).toBeTruthy()
  })
})
