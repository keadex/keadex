import { DiagramElementType } from '@keadex/c4-model-ui-kit'
import { Project } from '../../models/autogenerated/Project'
import { LibraryElementType } from '../../views/LibraryElement/LibraryElement'

export interface ModalCRULibraryElementProps {
  mode?: 'library' | 'serializer'
  libraryElement?: Partial<LibraryElementType>
  project?: Project
  enableEdit: boolean
  forceUpdate: () => void
  hideModal: () => void
  onElementCreated?: (element: DiagramElementType) => void
}
