import { objectsAreEqual } from '@keadex/keadex-utils'
import { capitalCase, constantCase, kebabCase, noCase } from 'change-case'
import pluralize from 'pluralize'
import { C4BaseComponent } from '../components/C4BaseComponent'
import { Boundary } from '../models/autogenerated/Boundary'
import { BoundaryType } from '../models/autogenerated/BoundaryType'
import { C4ElementType } from '../models/autogenerated/C4ElementType'
import { Component } from '../models/autogenerated/Component'
import { ComponentType } from '../models/autogenerated/ComponentType'
import { Container } from '../models/autogenerated/Container'
import { ContainerType } from '../models/autogenerated/ContainerType'
import { DeploymentNode } from '../models/autogenerated/DeploymentNode'
import { DeploymentNodeType } from '../models/autogenerated/DeploymentNodeType'
import { DiagramElementSpec } from '../models/autogenerated/DiagramElementSpec'
import { DiagramElementType } from '../models/autogenerated/DiagramElementType'
import { DiagramSpec } from '../models/autogenerated/DiagramSpec'
import { DiagramType } from '../models/autogenerated/DiagramType'
import { ElementData } from '../models/autogenerated/ElementData'
import { ElementType } from '../models/autogenerated/ElementType'
import { Person } from '../models/autogenerated/Person'
import { PersonType } from '../models/autogenerated/PersonType'
import { Position } from '../models/autogenerated/Position'
import { Relationship } from '../models/autogenerated/Relationship'
import { RelationshipType } from '../models/autogenerated/RelationshipType'
import { SoftwareSystem } from '../models/autogenerated/SoftwareSystem'
import { SystemType } from '../models/autogenerated/SystemType'
import { ELEMENT } from '../styles/style-constants'

export const getElementSpecByAlias = (
  alias: string,
  from: string | undefined,
  to: string | undefined,
  elementType: ElementType | undefined,
  diagramSpec: DiagramSpec,
): DiagramElementSpec => {
  const elementSpec = getElementSpec(
    alias,
    from,
    to,
    elementType,
    diagramSpec.elements_specs,
  )
  if (!elementSpec) {
    return generateDefaultDiagramElementSpec(alias, from, to, elementType)
  } else {
    return elementSpec
  }
}

const getElementSpec = (
  alias: string | undefined,
  from: string | undefined,
  to: string | undefined,
  elementType: ElementType | undefined,
  elementsSpecs: DiagramElementSpec[],
): DiagramElementSpec | undefined => {
  for (let i = 0; i < elementsSpecs.length; i++) {
    const currentElementSpec = elementsSpecs[i]
    const isMatchingAlias = currentElementSpec.alias === alias
    const isMatchingElementType = objectsAreEqual(
      currentElementSpec.element_type,
      elementType,
    )

    if (isMatchingAlias && isMatchingElementType) {
      return currentElementSpec
    }

    if (currentElementSpec.inner_specs) {
      const innerSpecs = currentElementSpec.inner_specs
      const foundDiagramElementSpec = getElementSpec(
        alias,
        from,
        to,
        elementType,
        innerSpecs,
      )

      if (foundDiagramElementSpec) {
        return foundDiagramElementSpec
      }
    }
  }

  return undefined
}

const generateDefaultDiagramElementSpec = (
  alias: string | undefined,
  from: string | undefined,
  to: string | undefined,
  elementType?: ElementType,
): DiagramElementSpec => {
  return {
    alias,
    from,
    to,
    element_type: elementType,
  }
}

export const isDefaultDiagramElementSpec = (
  diagramElementSpec: DiagramElementSpec,
): boolean => {
  return (
    diagramElementSpec !== undefined &&
    diagramElementSpec.position === undefined &&
    diagramElementSpec.size === undefined &&
    (diagramElementSpec.shapes === undefined ||
      diagramElementSpec.shapes.length === 0) &&
    (diagramElementSpec.inner_specs === undefined ||
      diagramElementSpec.inner_specs.length === 0)
  )
}

export const updateDiagramElementsSpecsFromCanvas = (
  canvas?: fabric.Canvas,
): Array<DiagramElementSpec> => {
  const newDiagramElementsSpecs = Array<DiagramElementSpec>()
  if (canvas) {
    const objects = canvas.getObjects()
    objects.forEach((object) => {
      // Diagram element specs should be generated only it the diagram element
      // has been customized (custom position, size, etc.), otherwise the rendering
      // system will use the generated auto layout
      if (object instanceof C4BaseComponent) {
        const newDiagramElementSpecs = object.getUpdatedSpecs()
        if (newDiagramElementSpecs)
          newDiagramElementsSpecs.push(newDiagramElementSpecs)
      }
    })
  }
  return newDiagramElementsSpecs
}

export const boundaryDiagramElement = (
  element: DiagramElementType | ElementType,
): Boundary | BoundaryType | undefined => {
  if ('Boundary' in element) {
    return element.Boundary
  }
  return
}

export const componentDiagramElement = (
  element: DiagramElementType | ElementType,
): Component | ComponentType | undefined => {
  if ('Component' in element) {
    return element.Component
  }
  return
}

export const containerDiagramElement = (
  element: DiagramElementType | ElementType,
): Container | ContainerType | undefined => {
  if ('Container' in element) {
    return element.Container
  }
  return
}

export const deploymentNodeDiagramElement = (
  element: DiagramElementType | ElementType,
): DeploymentNode | DeploymentNodeType | undefined => {
  if ('DeploymentNode' in element) {
    return element.DeploymentNode
  }
  return
}

export const personDiagramElement = (
  element: DiagramElementType | ElementType,
): Person | PersonType | undefined => {
  if ('Person' in element) {
    return element.Person
  }
  return
}

export const relationshipDiagramElement = (
  element: DiagramElementType | ElementType,
): Relationship | RelationshipType | undefined => {
  if ('Relationship' in element) {
    return element.Relationship
  }
  return
}

export const softwareSystemDiagramElement = (
  element: DiagramElementType | ElementType,
): SoftwareSystem | SystemType | undefined => {
  if ('SoftwareSystem' in element) {
    return element.SoftwareSystem
  }
  return
}

export const diagramTypeHumanName = (diagramType: DiagramType): string => {
  return capitalCase(noCase(diagramType))
}

export const parseDiagramTypeHumanName = (
  diagramTypeHumanName: string,
): DiagramType => {
  return constantCase(diagramTypeHumanName) as DiagramType
}

export const diagramDirName = (diagramHumanName: string): string => {
  return kebabCase(noCase(diagramHumanName))
}

export const c4ElementTypeHumanName = (
  c4ElementType: C4ElementType,
): string => {
  return capitalCase(noCase(c4ElementType))
}

export const c4ElementTypePathName = (c4ElementType: C4ElementType): string => {
  return pluralize(kebabCase(noCase(c4ElementType)))
}

export const locationEntityHumanName = (locationEntity: string): string => {
  return locationEntity.endsWith('Ext') ? 'external' : 'internal'
}

export const personTypeHumanName = (personType: PersonType): string => {
  return capitalCase(noCase(personType))
}

export const getAutoPosition = (
  alias: string | undefined,
  autoLayout: Record<string, ElementData>,
): Position => {
  if (alias && autoLayout[alias]?.position) {
    return {
      left: autoLayout[alias].position?.x,
      top: autoLayout[alias].position?.y,
    }
  }
  return {
    left: ELEMENT.SIZES.DEFAULT_LEFT,
    top: ELEMENT.SIZES.DEFAULT_TOP,
  }
}

export const isRelationshipAlias = (alias: string) => {
  return alias.includes(' -> ')
}

export const isLegendAlias = (alias: string) => {
  return alias === 'legend'
}
