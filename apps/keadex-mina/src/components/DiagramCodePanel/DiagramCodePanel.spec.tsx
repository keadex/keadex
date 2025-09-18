import { render } from '@testing-library/react'
import DiagramCodePanel from './DiagramCodePanel'
import { SetStateAction } from 'react'

describe('DiagramCodePanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramCodePanel
        setDiagramCodePanelVisible={function (
          value: SetStateAction<boolean>,
        ): void {
          //
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
