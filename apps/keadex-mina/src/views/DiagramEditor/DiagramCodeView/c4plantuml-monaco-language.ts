import {
  ADD_ELEMENT_TAG_TYPES,
  AddElementTagType,
  BOUNDARY_TYPES,
  BoundaryType,
  COMPONENT_TYPES,
  ComponentType,
  CONTAINER_TYPES,
  ContainerType,
  DEPLOYMENT_NODE_TYPES,
  DeploymentNodeType,
  PERSON_TYPES,
  PersonType,
  RELATIONSHIP_TYPES,
  RelationshipType,
  SYSTEM_TYPES,
  SystemType,
} from '@keadex/c4-model-ui-kit'
import * as monaco from 'monaco-editor'
import { IMarkdownString, IRange } from 'monaco-editor'

type AggregatedParameterInformation = monaco.languages.ParameterInformation & {
  numAggregatedParameters?: number
}

type C4PlantUMLParameterType =
  | 'alias'
  | 'label'
  | 'description'
  | 'type'
  | 'technology'
  | 'from'
  | 'to'
  | 'sprite'
  | 'tags'
  | 'link'
  | 'tag'
  | 'bgColor'
  | 'fontColor'
  | 'borderColor'
  | 'shadowing'
  | 'shape'
  | 'explicitTechnology'
  | 'legendText'
  | 'legendSprite'
  | 'borderStyle'
  | 'borderThickness'

type C4PlantUMLSignatureType =
  | 'context_person'
  | 'container_component'
  | 'boundary_custom_type'
  | 'boundary'
  | 'relationship'
  | 'deployment_node'
  | 'add_element_tag'

export const PLANTUML_LANGUAGE = 'plantuml'

const SIGNATURE_ELEMENT_TEMPLATE = '${ELEMENT_TYPE}'
const SIGNATURE_ELEMENT_TEMPLATE_REGEX = '\\${ELEMENT_TYPE}'
const C4PLANTUML_PARAMETERS: Record<
  C4PlantUMLParameterType,
  AggregatedParameterInformation
> = {
  alias: {
    label: 'alias',
    documentation: {
      value: 'Unique identification of the element.\n\nExample: `"myAlias"`',
      isTrusted: true,
    },
  },
  label: {
    label: 'label',
    documentation: {
      value:
        'Label of the element that will be rendered in the diagram.\n\nExample: `"My Label"`',
      isTrusted: true,
    },
  },
  description: {
    label: '?description',
    documentation: {
      value:
        'Optional description of the element that will be rendered in the diagram.\n\nExample: `"My description."`',
      isTrusted: true,
    },
  },
  type: {
    label: '?type',
    documentation: {
      value:
        'Optional custom type of a C4 Boundary or Deployment Node element.\n\nExample: `"My type"`',
      isTrusted: true,
    },
  },
  technology: {
    label: '?technology',
    documentation: {
      value:
        'Optional technology that the element is based on or uses to interact with another element.\n\nExample: `"My technology"`',
      isTrusted: true,
    },
  },
  from: {
    label: 'from',
    documentation: {
      value:
        'Alias of the source element in the relationship.\n\nExample: `"fromAlias"`',
      isTrusted: true,
    },
  },
  to: {
    label: 'to',
    documentation: {
      value:
        'Alias of the destination element in the relationship.\n\nExample: `"toAlias"`',
      isTrusted: true,
    },
  },
  sprite: {
    label: '?sprite',
    documentation: {
      value:
        'Optional PlantUML Sprite: a small graphic element that can be used in diagrams.\nSprites are ignored by Mina, but they are supported to accept PlantUML code from other PlantUML tools.\n\nExample: `$sprite="person"`',
      isTrusted: true,
    },
  },
  tags: {
    label: '?tags',
    documentation: {
      value:
        'Optional tags for tagging the element.\n\nExample: `$tags="tag1&tag2"`',
      isTrusted: true,
    },
  },
  link: {
    label: '?link',
    documentation: {
      value:
        'Optional link for connecting the element to another Mina diagram. The syntax of the link string follows this pattern: `<DIAGRAM_TYPE>/<DIAGRAM_NAME>`.\n\nExample: `$link="system-context/my-diagram"`',
      isTrusted: true,
    },
  },
  tag: {
    label: 'tag',
    documentation: {
      value:
        'Tag you want to use to customize elements.\n\nExample: `"my-tag"`',
      isTrusted: true,
    },
  },
  bgColor: {
    label: '?bgColor',
    documentation: {
      value: 'Optional background color.\n\nExample: `$bgColor="#000000"`',
      isTrusted: true,
    },
  },
  fontColor: {
    label: '?fontColor',
    documentation: {
      value: 'Optional font color.\n\nExample: `$fontColor="#000000"`',
      isTrusted: true,
    },
  },
  borderColor: {
    label: '?borderColor',
    documentation: {
      value: 'Optional border color.\n\nExample: `$borderColor="#000000"`',
      isTrusted: true,
    },
  },
  shadowing: {
    label: '?shadowing',
    documentation: {
      value:
        'Optional boolean that indicates whether to add a shadow.\nShadowing is ignored by Mina, but it is supported to accept PlantUML code from other PlantUML tools.\n\nExample: `$shadowing="true"`',
      isTrusted: true,
    },
  },
  shape: {
    label: '?shape',
    documentation: {
      value:
        'Optional PlantUML function or string to customize the shape.\nShape is ignored by Mina, but it is supported to accept PlantUML code from other PlantUML tools.\n\nExample: `$shape=RoundedBoxShape()`',
      isTrusted: true,
    },
  },
  explicitTechnology: {
    label: '?technology',
    documentation: {
      value:
        'Optional technology of the element.\n\nExample: `$techn="My technology"`',
      isTrusted: true,
    },
  },
  legendText: {
    label: '?legendText',
    documentation: {
      value:
        'Optional text to display in the legend entry for this tag.\n\nExample: `"My Legend Text"`',
      isTrusted: true,
    },
  },
  legendSprite: {
    label: '?legendSprite',
    documentation: {
      value:
        'Optional PlantUML Sprite for the legend entry.\nLegend Sprite is ignored by Mina, but it is supported to accept PlantUML code from other PlantUML tools.\n\nExample: `$legendSprite="my_legend_sprite"`',
      isTrusted: true,
    },
  },
  borderStyle: {
    label: '?borderStyle',
    documentation: {
      value:
        'Optional PlantUML function or string to customize the border style.\nBorder Style is ignored by Mina, but it is supported to accept PlantUML code from other PlantUML tools.\n\nExample: `$borderStyle="dashed"`',
      isTrusted: true,
    },
  },
  borderThickness: {
    label: '?borderThickness',
    documentation: {
      value:
        'Optional number to customize the border thickness.\nBorder thickness is ignored by Mina, but it is supported to accept PlantUML code from other PlantUML tools.\n\nExample: `$borderThickness="2"`',
      isTrusted: true,
    },
  },
}
const C4PLANTUML_SIGNATURES = generateC4PlantUMLSignatures()

function aggregateOptionalParameters(
  parameterTypes: C4PlantUMLParameterType[],
): AggregatedParameterInformation {
  const parameters: {
    label: string
    documentation: string
  }[] = []
  let parameterLabel = ''
  let parameterDocumentation = ''

  parameterTypes.forEach((parameterType) => {
    const label: string =
      typeof C4PLANTUML_PARAMETERS[parameterType].label === 'string'
        ? (C4PLANTUML_PARAMETERS[parameterType].label as string)
        : ''

    const documentation: string =
      typeof C4PLANTUML_PARAMETERS[parameterType].documentation === 'string'
        ? (C4PLANTUML_PARAMETERS[parameterType].documentation as string)
        : (
            C4PLANTUML_PARAMETERS[parameterType]
              .documentation as IMarkdownString
          ).value

    parameters.push({ label, documentation })
  })

  parameterLabel = `[${parameters
    .map((parameter) => parameter.label)
    .join(', ')}]`
  parameterDocumentation = `#### Optional inputs:\n\n\n${parameters
    .map(
      (parameter) =>
        `• \`${parameter.label.replace(new RegExp('\\?', 'gi'), '')}\`: ${
          parameter.documentation
        }`,
    )
    .join('\n\n')}`

  return {
    label: parameterLabel,
    documentation: {
      value: parameterDocumentation,
      isTrusted: true,
    },
    numAggregatedParameters: parameterTypes.length,
  }
}

function generateC4PlantUMLSignatures(): Record<
  C4PlantUMLSignatureType,
  monaco.languages.SignatureInformation
> {
  const signatures: Record<
    C4PlantUMLSignatureType,
    monaco.languages.SignatureInformation
  > = {
    context_person: {
      label: '',
      parameters: [
        C4PLANTUML_PARAMETERS['alias'],
        C4PLANTUML_PARAMETERS['label'],
        aggregateOptionalParameters(['description', 'sprite', 'tags', 'link']),
      ],
    },
    container_component: {
      label: '',
      parameters: [
        C4PLANTUML_PARAMETERS['alias'],
        C4PLANTUML_PARAMETERS['label'],
        aggregateOptionalParameters([
          'technology',
          'description',
          'sprite',
          'tags',
          'link',
        ]),
      ],
    },
    boundary_custom_type: {
      label: '',
      parameters: [
        C4PLANTUML_PARAMETERS['alias'],
        C4PLANTUML_PARAMETERS['label'],
        aggregateOptionalParameters(['type', 'tags', 'link']),
      ],
    },
    boundary: {
      label: '',
      parameters: [
        C4PLANTUML_PARAMETERS['alias'],
        C4PLANTUML_PARAMETERS['label'],
        aggregateOptionalParameters(['tags', 'link']),
      ],
    },
    relationship: {
      label: '',
      parameters: [
        C4PLANTUML_PARAMETERS['from'],
        C4PLANTUML_PARAMETERS['to'],
        C4PLANTUML_PARAMETERS['label'],
        aggregateOptionalParameters([
          'technology',
          'description',
          'sprite',
          'tags',
          'link',
        ]),
      ],
    },
    deployment_node: {
      label: '',
      parameters: [
        C4PLANTUML_PARAMETERS['alias'],
        C4PLANTUML_PARAMETERS['label'],
        aggregateOptionalParameters([
          'type',
          'description',
          'sprite',
          'tags',
          'link',
        ]),
      ],
    },
    add_element_tag: {
      label: '',
      parameters: [
        C4PLANTUML_PARAMETERS['tag'],
        aggregateOptionalParameters([
          'bgColor',
          'fontColor',
          'borderColor',
          'shadowing',
          'shape',
          'sprite',
          'explicitTechnology',
          'legendText',
          'legendSprite',
          'borderStyle',
          'borderThickness',
        ]),
      ],
    },
  }

  Object.keys(signatures).forEach((key) => {
    const signatureType = key as C4PlantUMLSignatureType
    const label = `${SIGNATURE_ELEMENT_TEMPLATE}(${signatures[
      signatureType
    ].parameters
      .map((param) => param.label)
      .join(', ')})`
    signatures[signatureType].label = label
  })

  return signatures
}

function getPlantUMLSignature(
  element: string,
): monaco.languages.SignatureInformation | undefined {
  try {
    let id: C4PlantUMLSignatureType | undefined
    if (
      PERSON_TYPES.includes(element as PersonType) ||
      SYSTEM_TYPES.includes(element as SystemType)
    ) {
      id = 'context_person'
    } else if (
      CONTAINER_TYPES.includes(element as ContainerType) ||
      COMPONENT_TYPES.includes(element as ComponentType)
    ) {
      id = 'container_component'
    } else if ((element as BoundaryType) === 'Boundary') {
      id = 'boundary'
    } else if (BOUNDARY_TYPES.includes(element as BoundaryType)) {
      id = 'boundary_custom_type'
    } else if (RELATIONSHIP_TYPES.includes(element as RelationshipType)) {
      id = 'relationship'
    } else if (DEPLOYMENT_NODE_TYPES.includes(element as DeploymentNodeType)) {
      id = 'deployment_node'
    } else if (ADD_ELEMENT_TAG_TYPES.includes(element as AddElementTagType)) {
      id = 'add_element_tag'
    }

    if (id && C4PLANTUML_SIGNATURES[id]) {
      const signature = { ...C4PLANTUML_SIGNATURES[id] }
      signature.label = signature.label.replace(
        new RegExp(SIGNATURE_ELEMENT_TEMPLATE_REGEX, 'gi'),
        element,
      )
      return signature
    }
  } catch (error) {
    console.error(error)
  }
}

function getActiveParameter(
  line: string,
  parameters: AggregatedParameterInformation[],
) {
  let activeParameter = 0
  const params = line.split(',')
  if (params.length > 0) {
    activeParameter = params.length - 1
    if (activeParameter >= parameters.length) {
      // "-1" since one of the parameters is the aggregated one
      if (
        parameters[parameters.length - 1].numAggregatedParameters &&
        activeParameter >=
          parameters.length -
            1 +
            parameters[parameters.length - 1].numAggregatedParameters!
      ) {
        activeParameter = -1
      } else {
        activeParameter = parameters.length - 1
      }
    }
  }
  return activeParameter
}

function createC4ElementProposals(
  range: IRange,
): monaco.languages.CompletionItem[] {
  const c4Elements = [
    ...PERSON_TYPES,
    ...SYSTEM_TYPES,
    ...CONTAINER_TYPES,
    ...COMPONENT_TYPES,
    ...BOUNDARY_TYPES,
    ...DEPLOYMENT_NODE_TYPES,
    ...RELATIONSHIP_TYPES,
    ...ADD_ELEMENT_TAG_TYPES,
  ]
  try {
    return c4Elements.map((element) => {
      // const isContainerElement =
      //   BOUNDARY_TYPES.includes(element as BoundaryType) ||
      //   DEPLOYMENT_NODE_TYPES.includes(element as DeploymentNodeType)

      return {
        label: {
          label: element.toString(),
        },
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: element.toString(),
        // insertText: `${element.toString()}($0) ${
        //   isContainerElement ? '{\n}' : ''
        // }`,
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range,
      }
    })
  } catch (error) {
    console.error(error)
    return []
  }
}

function isValidC4PlantUMLPosition(line: string) {
  return line.match(/^(\s|\n)*$/gm) !== null
}

export function initC4PlantUMLLanguage() {
  if (
    monaco.languages
      .getLanguages()
      .findIndex((lang) => lang.id === PLANTUML_LANGUAGE) === -1
  ) {
    monaco.languages.register({ id: PLANTUML_LANGUAGE })
    monaco.languages.registerCompletionItemProvider(PLANTUML_LANGUAGE, {
      provideCompletionItems: function (model, position) {
        // Return C4 Elements proposals only if the current line is empty or contains only spaces
        // since in the C4 PlantUML syntax, C4 elements are not allowed in all the other cases
        const lineTextUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column - 1,
        })
        if (!isValidC4PlantUMLPosition(lineTextUntilPosition)) {
          return { suggestions: [] }
        }

        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }
        return {
          suggestions: createC4ElementProposals(range),
        }
      },
    })

    monaco.languages.registerSignatureHelpProvider(PLANTUML_LANGUAGE, {
      signatureHelpTriggerCharacters: ['(', ','],
      provideSignatureHelp: (model, position, token) => {
        const emptySignature = {
          dispose: () => {
            //
          },
          value: {
            activeParameter: -1,
            activeSignature: -1,
            signatures: [],
          },
        }

        const lineTextUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        })
        const element = lineTextUntilPosition
          .substring(0, lineTextUntilPosition.indexOf('('))
          .replace(new RegExp(' ', 'gi'), '')

        const signature = getPlantUMLSignature(element)

        if (!signature) return emptySignature

        return {
          dispose: () => {
            //
          },
          value: {
            activeParameter: getActiveParameter(
              lineTextUntilPosition,
              signature.parameters,
            ),
            activeSignature: 0,
            signatures: [signature],
          },
        }
      },
    })
  }
}
