import { render } from '@testing-library/react'

import MinaShareDiagram from './MinaShareDiagram'

describe('MinaShareDiagram', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaShareDiagram lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
