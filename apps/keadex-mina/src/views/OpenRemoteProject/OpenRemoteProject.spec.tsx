import { render } from '@testing-library/react'

import OpenRemoteProject from './OpenRemoteProject'

describe('OpenRemoteProject', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OpenRemoteProject />)
    expect(baseElement).toBeTruthy()
  })
})
