import { render } from '@testing-library/react'

import DiagramEditorToolbar from './DiagramEditorToolbar'

describe('DiagramEditorToolbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramEditorToolbar
        diagramCodeViewCommands={null}
        diagramDesignViewCommands={null}
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
