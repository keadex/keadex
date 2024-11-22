import {
  C4ElementType,
  Component,
  Container,
  DiagramElementType,
  Person,
  SoftwareSystem,
  componentDiagramElement,
  containerDiagramElement,
  personDiagramElement,
  softwareSystemDiagramElement,
} from '@keadex/c4-model-ui-kit'
import { LibraryElementType } from '../views/LibraryElement/LibraryElement'

export function libraryDiagramElement(
  element: DiagramElementType,
): { element: LibraryElementType; elementType: C4ElementType } | undefined {
  if (personDiagramElement(element) !== undefined) {
    return {
      element: personDiagramElement(element) as Person,
      elementType: 'Person',
    }
  } else if (softwareSystemDiagramElement(element) !== undefined) {
    return {
      element: softwareSystemDiagramElement(element) as SoftwareSystem,
      elementType: 'SoftwareSystem',
    }
  } else if (containerDiagramElement(element) !== undefined) {
    return {
      element: containerDiagramElement(element) as Container,
      elementType: 'Container',
    }
  } else if (componentDiagramElement(element) !== undefined) {
    return {
      element: componentDiagramElement(element) as Component,
      elementType: 'Component',
    }
  }
  return
}
