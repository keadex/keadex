import { render } from '@testing-library/react'
import DiagramInfoPanel from './DiagramInfoPanel'
import { SetStateAction } from 'react'

describe('DiagramInfoPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramInfoPanel
        setDiagramInfoPanelVisible={function (
          value: SetStateAction<boolean>,
        ): void {
          //
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
