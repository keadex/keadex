import { render } from '@testing-library/react'

import MinaRendering from './MinaRendering'

describe('MinaRendering', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaRendering lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
