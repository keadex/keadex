import { render } from '@testing-library/react'

import ModalCRUDeploymentNode from './ModalCRUDeploymentNode'

describe('ModalCRUDeploymentNode', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalCRUDeploymentNode
        enableEdit={true}
        hideModal={() => {
          console.log('test')
        }}
        forceUpdate={() => {
          console.log('test')
        }}
        diagramAliases={[]}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
