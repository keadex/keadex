import { render } from '@testing-library/react'
import DropdownMenuItem from './DropdownMenuItem'

describe('IconButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DropdownMenuItem isHeaderMenuItem={false} id={''} label={''} />
    )
    expect(baseElement).toBeTruthy()
  })
})
