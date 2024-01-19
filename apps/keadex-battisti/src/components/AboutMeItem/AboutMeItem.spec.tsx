import { render } from '@testing-library/react'

import AboutMeItem from './AboutMeItem'

describe('AboutMeItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AboutMeItem lang={'en'} role="IT Architect" skills={[]} areas={[]} />,
    )
    expect(baseElement).toBeTruthy()
  })
})
