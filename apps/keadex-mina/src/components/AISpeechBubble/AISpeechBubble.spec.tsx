import { render } from '@testing-library/react'

import AISpeechBubble from './AISpeechBubble'

describe('AISpeechBubble', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AISpeechBubble />)
    expect(baseElement).toBeTruthy()
  })
})
