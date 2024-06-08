import { render } from '@testing-library/react'

import DiagramCodeViewToolbar from './DiagramCodeViewToolbar'

describe('DiagramCodeViewToolbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramCodeViewToolbar diagramCodeViewCommands={null} />,
    )
    expect(baseElement).toBeTruthy()
  })
})
