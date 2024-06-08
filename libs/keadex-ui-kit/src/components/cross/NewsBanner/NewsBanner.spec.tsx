import { render } from '@testing-library/react'
import NewsBanner from './NewsBanner'

describe('NewsBanner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NewsBanner content={'Test'} />)
    expect(baseElement).toBeTruthy()
  })
})
