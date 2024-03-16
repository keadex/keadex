import { render } from '@testing-library/react'

import MinaAI from './MinaAI'

describe('MinaAI', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaAI lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
