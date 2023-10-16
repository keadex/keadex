import { render } from '@testing-library/react'

import DiagramEditorToolbar from './DiagramEditorToolbar'

describe('DiagramEditorToolbar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DiagramEditorToolbar />)
    expect(baseElement).toBeTruthy()
  })
})
