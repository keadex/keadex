import { render } from '@testing-library/react'

import TableOptions from './TableOptions'

describe('TableOptions', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TableOptions menuOptions={[]} />)
    expect(baseElement).toBeTruthy()
  })
})
