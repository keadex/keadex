import { render } from '@testing-library/react'

import GitHubRepoSelector from './GitHubRepoSelector'

describe('GitHubRepoSelector', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GitHubRepoSelector />)
    expect(baseElement).toBeTruthy()
  })
})
