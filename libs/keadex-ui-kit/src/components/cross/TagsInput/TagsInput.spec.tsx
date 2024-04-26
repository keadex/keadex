import { render } from '@testing-library/react'
import TagsInput from './TagsInput'

describe('TagsInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TagsInput id="test" tags={[]} />)
    expect(baseElement).toBeTruthy()
  })
})
