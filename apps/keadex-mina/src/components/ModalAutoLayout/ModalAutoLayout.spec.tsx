import { render } from '@testing-library/react'

import ModalAutoLayout from './ModalAutoLayout'
import { DiagramOrientation } from '@keadex/c4-model-ui-kit'

describe('ModalAutoLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalAutoLayout
        hideModal={() => {
          console.log('test')
        }}
        onAutoLayoutConfigured={(
          enabled: boolean,
          orientation: DiagramOrientation,
          generateOnlyStraightArrows: boolean,
        ) => {
          console.log('test')
        }}
        enabled={false}
        orientation={'TopToBottom'}
        generateOnlyStraightArrows={false}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
