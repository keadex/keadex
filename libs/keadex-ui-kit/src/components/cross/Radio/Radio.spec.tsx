import { render } from '@testing-library/react'
import Radio from './Radio'

describe('Radio', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Radio
        id="test"
        options={[]}
        onChange={(value: unknown) => {
          console.log('test')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
