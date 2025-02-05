import { Graphviz } from '@hpcc-js/wasm-graphviz'
import { C4BaseComponent, DiagramListener } from '../components/C4BaseComponent'
import C4Legend, { ALIAS as LEGEND_ALIAS } from '../components/C4Legend'
import {
  boundaryDiagramElement,
  componentDiagramElement,
  containerDiagramElement,
  deploymentNodeDiagramElement,
  getElementSpecByAlias,
  personDiagramElement,
  relationshipDiagramElement,
  softwareSystemDiagramElement,
} from '../helper/diagram-helper'
import { getSavedZIndex, getZIndexOfObject } from '../helper/fabric-helper'
import { Boundary } from '../models/autogenerated/Boundary'
import { Component } from '../models/autogenerated/Component'
import { Container } from '../models/autogenerated/Container'
import { DeploymentNode } from '../models/autogenerated/DeploymentNode'
import { Diagram } from '../models/autogenerated/Diagram'
import { DiagramElementType } from '../models/autogenerated/DiagramElementType'
import { DiagramSpec } from '../models/autogenerated/DiagramSpec'
import { DiagramsThemeSettings } from '../models/autogenerated/DiagramsThemeSettings'
import { ElementData } from '../models/autogenerated/ElementData'
import { Person } from '../models/autogenerated/Person'
import { Relationship } from '../models/autogenerated/Relationship'
import { SoftwareSystem } from '../models/autogenerated/SoftwareSystem'
import { DIAGRAM } from '../styles/style-constants'
import { generateAutoLayout } from './auto-layout'
import { renderBoundaryDiagramElement } from './boundary-renderer'
import { renderComponentDiagramElement } from './component-renderer'
import { renderContainerDiagramElement } from './container-renderer'
import { renderDeploymentNodeDiagramElement } from './deployment-node-renderer'
import { renderPersonDiagramElement } from './person-renderer'
import { renderRelationshipDiagramElement } from './relationship-renderer'
import { renderSoftwareSystemDiagramElement } from './software-system-renderer'

export class DiagramRenderer {
  graphviz?: Graphviz

  async initialize(): Promise<DiagramRenderer> {
    this.graphviz = await Graphviz.load()
    return this
  }

  renderDiagram(
    canvas: fabric.Canvas,
    diagramListener: DiagramListener,
    diagram: Diagram | undefined,
    diagramsThemeSettings: DiagramsThemeSettings | undefined,
  ): C4BaseComponent[] | undefined {
    if (canvas && diagram) {
      canvas.diagramListener = diagramListener
      canvas.autoLayoutEnabled = diagram.diagram_spec?.auto_layout_enabled
      canvas.autoLayoutOrientation =
        diagram.diagram_spec?.auto_layout_orientation
      canvas.backgroundColor =
        diagramsThemeSettings?.bg_color_diagram ?? DIAGRAM.COLOR.BG_COLOR

      if (diagram.diagram_spec?.auto_layout_enabled) {
        if (this.graphviz)
          diagram.auto_layout = generateAutoLayout(this.graphviz, diagram)
        else
          console.error(
            'Graphviz not initialized. Cannot generate auto layout.',
          )
      }

      const components = renderElements(
        canvas,
        diagram.diagram_plantuml?.elements,
        diagram.diagram_spec,
        diagram.auto_layout ?? {},
        {
          diagramsThemeSettings,
          autoLayoutOnlyStraightArrows:
            diagram.diagram_spec?.auto_layout_only_straight_arrows,
        },
      )
      restoreZIndex(components)
      return components
    }
    return
  }
}
export interface RenderElementsOptions {
  skipLegendRendering?: boolean
  skipAddToCanvas?: boolean
  diagramsThemeSettings?: DiagramsThemeSettings | undefined
  autoLayoutOnlyStraightArrows?: boolean
}

export const renderElements = (
  canvas: fabric.Canvas | undefined,
  diagramElements: DiagramElementType[] | undefined,
  diagramSpec: DiagramSpec | undefined,
  autoLayout: Record<string, ElementData>,
  options?: RenderElementsOptions,
): C4BaseComponent[] => {
  const components: C4BaseComponent[] = []
  if (diagramSpec) {
    if (!options || !options.skipLegendRendering) {
      const component = C4Legend(
        getElementSpecByAlias(
          LEGEND_ALIAS,
          undefined,
          undefined,
          undefined,
          diagramSpec,
        ),
        options,
      )
      if (component) {
        components.push(component)
        canvas?.add(component)
      }
    }
    if (diagramElements) {
      for (const element of diagramElements) {
        if (boundaryDiagramElement(element)) {
          const component = renderBoundaryDiagramElement(
            canvas,
            boundaryDiagramElement(element) as Boundary,
            diagramSpec,
            autoLayout,
            options,
          )
          if (component) components.push(component)
        } else if (componentDiagramElement(element)) {
          const component = renderComponentDiagramElement(
            canvas,
            componentDiagramElement(element) as Component,
            diagramSpec,
            autoLayout,
            options,
          )
          if (component) components.push(component)
        } else if (containerDiagramElement(element)) {
          const component = renderContainerDiagramElement(
            canvas,
            containerDiagramElement(element) as Container,
            diagramSpec,
            autoLayout,
            options,
          )
          if (component) components.push(component)
        } else if (deploymentNodeDiagramElement(element)) {
          const component = renderDeploymentNodeDiagramElement(
            canvas,
            deploymentNodeDiagramElement(element) as DeploymentNode,
            diagramSpec,
            autoLayout,
            options,
          )
          if (component) components.push(component)
        } else if (personDiagramElement(element)) {
          const component = renderPersonDiagramElement(
            canvas,
            personDiagramElement(element) as Person,
            diagramSpec,
            autoLayout,
            options,
          )
          if (component) components.push(component)
        } else if (relationshipDiagramElement(element)) {
          const component = renderRelationshipDiagramElement(
            canvas,
            relationshipDiagramElement(element) as Relationship,
            diagramSpec,
            autoLayout,
            options,
          )
          if (component) components.push(component)
        } else if (softwareSystemDiagramElement(element)) {
          const component = renderSoftwareSystemDiagramElement(
            canvas,
            softwareSystemDiagramElement(element) as SoftwareSystem,
            diagramSpec,
            autoLayout,
            options,
          )
          if (component) components.push(component)
        }
      }
    }
  }
  return components
}

/**
 * During the rendering process, it will be used the default z-index generated by Fabric.js.
 * Since the user might change the z-index from the Design View, this function is used
 * to restore the z-index eventually changed and saved by the user.
 *
 * IMPORTANT: This function must be executed only after all the objects are rendered
 * since the saved z-index is relative to all the objects on the canvas.
 *
 * @param components Fabric.js object to update
 */
const restoreZIndex = (components: fabric.Object[], parentZIndex?: number) => {
  components.forEach((component) => {
    let zIndex = getSavedZIndex(component)
    // console.debug(
    //   `Name:${
    //     component.name
    //   }\nParent zindex:${parentZIndex}\nSaved Zindex:${zIndex}\nCanvas zindex:${getZIndexOfObject(
    //     component.canvas,
    //     component,
    //   )}\nChildren: ${component.children?.length}`,
    // )
    if (zIndex) {
      if (parentZIndex && zIndex <= parentZIndex) {
        zIndex = parentZIndex + 1
        parentZIndex++
        // console.debug(`New zindex ${zIndex}`)
      }
      component.moveTo(zIndex)
    }

    if (component.isVirtualGroupParent()) {
      // In case of virtual groups, we must pass also the parent z-index since it will be used
      // to evetually fix the children z-indexes. If the parent z-index has not been saved,
      // we use the current z-index (genereated by Fabric.js) of the first children,
      // which is the base shape of the object (e.g. the rectangle in C4BaseElasticContainer)
      restoreZIndex(
        component.children!,
        zIndex ?? getZIndexOfObject(component.canvas, component.children![0]),
      )
    }
  })
}
