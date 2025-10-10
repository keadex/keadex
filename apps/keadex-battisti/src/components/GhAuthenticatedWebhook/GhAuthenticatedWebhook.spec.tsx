import { render } from '@testing-library/react'

import GhAuthenticatedWebhook from './GhAuthenticatedWebhook'

describe('GhAuthenticatedWebhook', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GhAuthenticatedWebhook token="test" />)
    expect(baseElement).toBeTruthy()
  })
})
