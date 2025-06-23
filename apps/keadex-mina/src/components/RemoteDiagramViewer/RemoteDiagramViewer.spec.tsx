import { render } from '@testing-library/react'

import RemoteDiagramViewer from './RemoteDiagramViewer'

describe('RemoteDiagramViewer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <RemoteDiagramViewer projectRootUrl={''} diagramUrl={''} />,
    )
    expect(baseElement).toBeTruthy()
  })
})
