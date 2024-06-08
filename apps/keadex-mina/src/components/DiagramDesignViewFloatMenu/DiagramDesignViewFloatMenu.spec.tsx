import { render } from '@testing-library/react'

import DiagramDesignViewFloatMenu from './DiagramDesignViewFloatMenu'

describe('DiagramDesignViewFloatMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiagramDesignViewFloatMenu />)
    expect(baseElement).toBeTruthy()
  })
})
