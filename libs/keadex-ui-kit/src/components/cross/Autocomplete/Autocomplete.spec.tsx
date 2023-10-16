import { render } from '@testing-library/react'
import Autocomplete from './Autocomplete'

describe('Select', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Autocomplete
        label="Test"
        options={[]}
        onTyping={function (value: string): void {
          console.log('test')
        }}
      />
    )
    expect(baseElement).toBeTruthy()
  })
})
