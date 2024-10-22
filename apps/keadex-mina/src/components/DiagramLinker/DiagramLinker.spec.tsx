import { render } from '@testing-library/react'

import DiagramLinker from './DiagramLinker'

describe('DiagramLinker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramLinker
        onLinkConfirmed={(link?: string) => {
          console.log('onLinkConfirmed')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
