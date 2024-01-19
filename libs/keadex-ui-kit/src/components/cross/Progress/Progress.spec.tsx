import { render } from '@testing-library/react'
import Progress from './Progress'

describe('Progress', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Progress width="25%" label="25%" />)
    expect(baseElement).toBeTruthy()
  })
})
