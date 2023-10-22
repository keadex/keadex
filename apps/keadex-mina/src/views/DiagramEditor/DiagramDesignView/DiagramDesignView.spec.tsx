import { render } from '@testing-library/react'

import DiagramDesignView from './DiagramDesignView'

describe('DiagramDesignView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramDesignView
        diagramListener={{
          onOpenDiagramClick: (diagramLink: string) => {
            console.log(`onOpenDiagramClick ${diagramLink}`)
          },
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
