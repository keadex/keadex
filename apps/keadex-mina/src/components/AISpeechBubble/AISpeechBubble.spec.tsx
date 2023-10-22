import { render } from '@testing-library/react'

import AISpeechBubble from './AISpeechBubble'

describe('AISpeechBubble', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AISpeechBubble
        addCodeAtCursorPosition={function (
          code: string,
          cursorPosition?: number | undefined,
        ): void {
          console.log('Function not implemented.')
        }}
        aiHidden={false}
        closeAI={function (): void {
          console.log('Function not implemented.')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
