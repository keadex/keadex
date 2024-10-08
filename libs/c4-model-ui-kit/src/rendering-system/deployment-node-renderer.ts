import { C4BaseElastiContainerComponent } from '../components/C4BaseElasticContainer'
import C4DeploymentNode from '../components/C4DeploymentNode'
import { getElementSpecByAlias } from '../helper/diagram-helper'
import { flatVirtualGroupChildren } from '../helper/fabric-helper'
import { DeploymentNode } from '../models/autogenerated/DeploymentNode'
import { DiagramSpec } from '../models/autogenerated/DiagramSpec'
import { ElementData } from '../models/autogenerated/ElementData'
import { RenderElementsOptions } from './diagram-renderer'

export const renderDeploymentNodeDiagramElement = (
  canvas: fabric.Canvas | undefined,
  deploymentNode: DeploymentNode,
  diagramSpec: DiagramSpec,
  autoLayout: Record<string, ElementData>,
  options: RenderElementsOptions | undefined,
): C4BaseElastiContainerComponent | undefined => {
  if (
    deploymentNode.base_data &&
    deploymentNode.base_data.alias &&
    deploymentNode.base_data.label &&
    deploymentNode.deployment_node_type &&
    ((diagramSpec.auto_layout_enabled &&
      autoLayout[deploymentNode.base_data.alias]) ||
      !diagramSpec.auto_layout_enabled)
  ) {
    const c4DeploymentNode = C4DeploymentNode(
      deploymentNode,
      getElementSpecByAlias(
        deploymentNode.base_data.alias,
        undefined,
        undefined,
        { DeploymentNode: deploymentNode.deployment_node_type },
        diagramSpec,
      ),
      diagramSpec,
      autoLayout,
      undefined,
      options,
    )
    if ((!options || !options.skipAddToCanvas) && c4DeploymentNode)
      canvas?.add(
        c4DeploymentNode,
        ...flatVirtualGroupChildren(c4DeploymentNode.children ?? []),
      )
    return c4DeploymentNode
  }
  return
}

export default renderDeploymentNodeDiagramElement
