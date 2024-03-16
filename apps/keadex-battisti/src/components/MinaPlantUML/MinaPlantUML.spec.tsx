import { render } from '@testing-library/react'

import MinaPlantUML from './MinaPlantUML'

describe('MinaPlantUML', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MinaPlantUML lang={'en'} />)
    expect(baseElement).toBeTruthy()
  })
})
