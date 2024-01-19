import { render } from '@testing-library/react'
import NoSSR from './NoSSR'

describe('NoSSR', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NoSSR />)
    expect(baseElement).toBeTruthy()
  })
})
