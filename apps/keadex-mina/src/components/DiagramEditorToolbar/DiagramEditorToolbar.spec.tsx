import { render } from '@testing-library/react'

import DiagramEditorToolbar from './DiagramEditorToolbar'

describe('DiagramEditorToolbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramEditorToolbar
        saveDiagram={function (): void {
          console.log('Function not implemented.')
        }}
        closeDiagram={function (): void {
          console.log('Function not implemented.')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
