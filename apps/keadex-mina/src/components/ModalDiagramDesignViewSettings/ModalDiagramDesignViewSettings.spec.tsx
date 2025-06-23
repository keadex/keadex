import { render } from '@testing-library/react'

import ModalDiagramDesignViewSettings from './ModalDiagramDesignViewSettings'
import { DiagramDesignViewSettings } from '../../views/DiagramEditor/DiagramDesignView/DiagramDesignView'

describe('ModalDiagramDesignViewSettings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalDiagramDesignViewSettings
        settings={{
          gridEnabled: undefined,
        }}
        hideModal={function (): void {
          console.log('test')
        }}
        onSettingsChanged={function (
          settings: DiagramDesignViewSettings,
        ): void {
          console.log('test')
        }}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
