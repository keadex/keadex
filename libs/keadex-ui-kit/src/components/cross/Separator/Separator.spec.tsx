import { render } from '@testing-library/react'
import Separator from './Separator'

describe('Table', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Separator />)
    expect(baseElement).toBeTruthy()
  })
})
