import { render } from '@testing-library/react'
import DiagramDesignViewFloatMenu from './DiagramDesignViewFloatMenu'
import { SetStateAction } from 'react'

describe('DiagramDesignViewFloatMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DiagramDesignViewFloatMenu
        diagramInfoPanelVisible={false}
        setDiagramInfoPanelVisible={function (
          value: SetStateAction<boolean>,
        ): void {
          //
        }}
        diagramCodePanelVisible={false}
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
