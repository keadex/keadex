import { render } from '@testing-library/react'

import MinaProjectStructure from './MinaProjectStructure'

describe('MinaProjectStructure', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaProjectStructure lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
