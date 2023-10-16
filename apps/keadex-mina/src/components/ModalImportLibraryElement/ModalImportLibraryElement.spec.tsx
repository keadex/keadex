import { render } from '@testing-library/react'
import { DiagramElementType } from '@keadex/c4-model-ui-kit'
import ModalImportLibraryElement from './ModalImportLibraryElement'

describe('ModalImportLibraryElement', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ModalImportLibraryElement
        onLibraryElementSelected={(libraryElement: DiagramElementType) => {
          console.log('test')
        }}
        hideModal={() => {
          console.log('test')
        }}
      />
    )
    expect(baseElement).toBeTruthy()
  })
})
