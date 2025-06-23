import { render } from '@testing-library/react'

import MinaLiveClient from './MinaLiveClient'

describe('MinaLiveCleint', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaLiveClient />)
    expect(baseElement).toBeTruthy()
  })
})
