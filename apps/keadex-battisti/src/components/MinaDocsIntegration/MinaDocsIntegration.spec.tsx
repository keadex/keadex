import { render } from '@testing-library/react'

import MinaDocsIntegration from './MinaDocsIntegration'

describe('MinaDocsIntegration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaDocsIntegration lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
