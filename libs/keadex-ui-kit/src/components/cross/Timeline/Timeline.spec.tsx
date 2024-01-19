import { render } from '@testing-library/react'

import Timeline from './Timeline'

describe('Timeline', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Timeline items={[]} />)
    expect(baseElement).toBeTruthy()
  })
})
