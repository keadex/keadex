import { render } from '@testing-library/react'

import ErrorFallback from './ErrorFallback'

describe('ErrorFallback', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ErrorFallback
        error={new Error('Test error')}
        resetErrorBoundary={() => {
          console.log('test')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
