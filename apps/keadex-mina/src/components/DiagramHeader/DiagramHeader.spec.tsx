import { render } from '@testing-library/react'
import DiagramHeader from './DiagramHeader'

describe('DiagramHeader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramHeader tagsDirection={'right'} scrollable={false} />,
    )
    expect(baseElement).toBeTruthy()
  })
})
