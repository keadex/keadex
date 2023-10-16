import { render } from '@testing-library/react'

import SearchPanel from './SearchPanel'

describe('SearchPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchPanel />)
    expect(baseElement).toBeTruthy()
  })
})
