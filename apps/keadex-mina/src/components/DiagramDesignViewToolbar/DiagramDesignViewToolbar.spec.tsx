import { render } from '@testing-library/react'

import DiagramDesignViewToolbar from './DiagramDesignViewToolbar'

describe('DiagramDesignViewToolbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramDesignViewToolbar diagramDesignViewCommands={null} />,
    )
    expect(baseElement).toBeTruthy()
  })
})
