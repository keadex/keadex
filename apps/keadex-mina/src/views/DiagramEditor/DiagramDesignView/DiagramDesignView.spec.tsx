import { render } from '@testing-library/react'

import DiagramDesignView from './DiagramDesignView'

describe('DiagramDesignView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiagramDesignView />)
    expect(baseElement).toBeTruthy()
  })
})
