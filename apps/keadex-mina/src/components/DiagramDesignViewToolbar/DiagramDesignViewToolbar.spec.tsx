import { render } from '@testing-library/react'

import DiagramDesignViewToolbar from './DiagramDesignViewToolbar'

describe('DiagramDesignViewToolbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiagramDesignViewToolbar />)
    expect(baseElement).toBeTruthy()
  })
})
