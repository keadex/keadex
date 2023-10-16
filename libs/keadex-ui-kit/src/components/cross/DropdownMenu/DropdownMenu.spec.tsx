import { render } from '@testing-library/react'
import DropdownMenu from './DropdownMenu'

describe('IconButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DropdownMenu menuItemsProps={[]} />)
    expect(baseElement).toBeTruthy()
  })
})
