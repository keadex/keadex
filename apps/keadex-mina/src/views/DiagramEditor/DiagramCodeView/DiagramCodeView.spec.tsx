import { render } from '@testing-library/react'

import DiagramCodeView from './DiagramCodeView'

describe('DiagramCodeView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramCodeView
        diagramEditorToolbarCommands={null}
        saveDiagram={function (): void {
          console.log('Function not implemented.')
        }}
        isSaving={false}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
