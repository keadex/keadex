import { Project } from '../../models/autogenerated/Project'
import { LibraryElementType } from '../../views/LibraryElement/LibraryElement'

export interface ModalCRULibraryElementProps {
  libraryElement?: Partial<LibraryElementType>
  project?: Project
  enableEdit: boolean
  forceUpdate: () => void
  hideModal: () => void
}
