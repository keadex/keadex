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
          onOpenExternalLinkClick: (externalLink: string) => {
            console.log(`onOpenExternalLinkClick ${externalLink}`)
          },
        }}
        saveDiagram={() => {
          console.log('test')
        }}
        target="desktop"
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
