import { render } from '@testing-library/react'
import Spinner from './Spinner'

describe('Spinner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Spinner />)
    expect(baseElement).toBeTruthy()
  })
})
