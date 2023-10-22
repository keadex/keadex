import { render } from '@testing-library/react'

import DiagramPicker from './DiagramPicker'

describe('DiagramPicker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramPicker
        onDiagramSelected={function (diagram?: string | undefined): void {
          console.log('Function not implemented.')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
