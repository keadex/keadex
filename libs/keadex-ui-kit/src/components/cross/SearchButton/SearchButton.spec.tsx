import { render } from '@testing-library/react'
import SearchButton from './SearchButton'

describe('SearchButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchButton />)
    expect(baseElement).toBeTruthy()
  })
})
