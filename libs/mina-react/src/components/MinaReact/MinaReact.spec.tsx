import { render } from '@testing-library/react'
import MinaReact from './MinaReact'

describe('MinaReact', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MinaReact projectRootUrl="" diagramUrl="" />,
    )
    expect(baseElement).toBeTruthy()
  })
})
