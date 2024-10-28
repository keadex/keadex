import { render } from '@testing-library/react'

import DependencyTable from './DependencyTable'

describe('DependencyTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DependencyTable />)
    expect(baseElement).toBeTruthy()
  })
})
