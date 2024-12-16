import { render } from '@testing-library/react'
import SplashScreen from './SplashScreen'

describe('SplashScreen', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SplashScreen />)
    expect(baseElement).toBeTruthy()
  })
})
