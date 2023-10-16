import { render } from '@testing-library/react'

import WindowTitlebar from './WindowTitlebar'

describe('WindowTitlebar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <WindowTitlebar icon={''} menuProps={{ menuItemsProps: [] }} />
    )
    expect(baseElement).toBeTruthy()
  })
})
