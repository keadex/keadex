import { render } from '@testing-library/react'
import Tag from './Tags'

describe('Tag', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tag tags={[]} />)
    expect(baseElement).toBeTruthy()
  })
})
