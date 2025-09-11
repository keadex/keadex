import { render } from '@testing-library/react'
import Checkbox from './Checkbox'

describe('Radio', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Checkbox
        id="test"
        options={[]}
        onChange={(id: string, value: boolean) => {
          console.log('test')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
