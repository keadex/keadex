import { render } from '@testing-library/react'

import ExternalDiagramViewer from './ExternalDiagramViewer'

describe('ExternalDiagramViewer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ExternalDiagramViewer projectRootUrl={''} diagramUrl={''} />,
    )
    expect(baseElement).toBeTruthy()
  })
})
