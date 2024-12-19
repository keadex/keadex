import {
  C4ElementType,
  Diagram,
  DiagramElementType,
  DiagramPlantUML,
  DiagramSpec,
  DiagramType,
} from '@keadex/c4-model-ui-kit'
import { invoke } from '@tauri-apps/api/core'
import { C4Elements } from '../models/autogenerated/C4Elements'
import { DiagramFormat } from '../models/autogenerated/DiagramFormat'
import { FileSearchResults } from '../models/autogenerated/FileSearchResults'
import { Project } from '../models/autogenerated/Project'
import { ProjectLibrary } from '../models/autogenerated/ProjectLibrary'
import { ProjectSettings } from '../models/autogenerated/ProjectSettings'
import { HookPayload } from '../models/autogenerated/HookPayload'
import { DiagramElementSearchResults } from '../models/autogenerated/DiagramElementSearchResults'

/*########################*/
/*    PROJECT COMMANDS    */
/*########################*/
export const CREATE_PROJECT_CMD = 'create_project'
export const OPEN_PROJECT_CMD = 'open_project'
export const CLOSE_PROJECT_CMD = 'close_project'
export const SAVE_PROJECT_SETTINGS_CMD = 'save_project_settings'

export async function createProject(
  projectSettings: ProjectSettings,
): Promise<ProjectSettings> {
  return invoke(CREATE_PROJECT_CMD, { projectSettings })
}

export async function openProject(root: string): Promise<Project> {
  return invoke(OPEN_PROJECT_CMD, { root })
}

export async function closeProject(root: string): Promise<boolean> {
  return invoke(CLOSE_PROJECT_CMD, { root })
}

export async function saveProjectSettings(
  projectSettings: ProjectSettings,
): Promise<ProjectSettings> {
  return invoke(SAVE_PROJECT_SETTINGS_CMD, { projectSettings })
}

/*########################*/
/*     SEARCH COMMANDS    */
/*########################*/
export const SEARCH_CMD = 'search'
export const SEARCH_DIAGRAM_ELEMENT_ALIAS_CMD = 'search_diagram_element_alias'

export async function search(
  stringToSearch: string,
  includeDiagramsDir: boolean,
  includeLibraryDir: boolean,
  limit: number,
): Promise<FileSearchResults> {
  return invoke(SEARCH_CMD, {
    stringToSearch,
    includeDiagramsDir,
    includeLibraryDir,
    limit,
  })
}

export async function searchDiagramElementAlias(
  alias: string,
  includeDiagramsDir: boolean,
  includeLibraryDir: boolean,
  limit: number,
): Promise<DiagramElementSearchResults> {
  return invoke(SEARCH_DIAGRAM_ELEMENT_ALIAS_CMD, {
    alias,
    includeDiagramsDir,
    includeLibraryDir,
    limit,
  })
}

/*########################*/
/*   DIAGRAMS COMMANDS    */
/*########################*/
export const LIST_DIAGRAMS_CMD = 'list_diagrams'
export const GET_DIAGRAM_CMD = 'get_diagram'
export const LOAD_DIAGRAM_CMD = 'open_diagram'
export const CLOSE_DIAGRAM_CMD = 'close_diagram'
export const CREATE_DIAGRAM_CMD = 'create_diagram'
export const DELETE_DIAGRAM_CMD = 'delete_diagram'
export const SAVE_SPEC_DIAGRAM_RAW_PLANTUML_CMD =
  'save_spec_diagram_raw_plantuml'
export const EXPORT_DIAGRAM_TO_FILE_CMD = 'export_diagram_to_file'
export const GENERATE_PLANTUML_CMD = 'generate_plantuml'
export const PARSED_ELEMENT_TO_PLANTUML_CMD = 'parsed_element_to_plantuml'
export const DIAGRAM_TO_LINK_STRING_CMD = 'diagram_to_link_string'
export const DIAGRAM_FROM_LINK_STRING_CMD = 'diagram_from_link_string'
export const DESERIALIZE_PLANTUML_BY_STRING_CMD =
  'deserialize_plantuml_by_string'
export const DIAGRAM_NAME_TYPE_FROM_PATH_CMD = 'diagram_name_type_from_path'
export const DEPENDENT_ELEMENTS_IN_DIAGRAM_CMD = 'dependent_elements_in_diagram'

export async function listDiagrams(): Promise<{
  [key in DiagramType]: string[]
}> {
  return invoke(LIST_DIAGRAMS_CMD)
}

export async function getDiagram(
  diagramName: string,
  diagramType: DiagramType,
): Promise<Diagram> {
  return invoke(GET_DIAGRAM_CMD, { diagramName, diagramType })
}

export async function loadDiagram(
  diagramName: string,
  diagramType: DiagramType,
): Promise<Diagram> {
  return invoke(LOAD_DIAGRAM_CMD, {
    diagramName,
    diagramType,
  })
}

export async function closeDiagram(
  diagramName: string,
  diagramType: DiagramType,
): Promise<Diagram> {
  return invoke(CLOSE_DIAGRAM_CMD, {
    diagramName,
    diagramType,
  })
}

export async function createDiagram(newDiagram: Diagram): Promise<boolean> {
  return invoke(CREATE_DIAGRAM_CMD, {
    newDiagram,
  })
}

export async function deleteDiagram(
  diagramName: string,
  diagramType: DiagramType,
): Promise<ProjectLibrary> {
  return invoke(DELETE_DIAGRAM_CMD, {
    diagramName,
    diagramType,
  })
}

export async function saveSpecDiagramRawPlantuml(
  diagramName: string,
  diagramType: DiagramType,
  rawPlantuml: string,
  diagramSpec: DiagramSpec,
): Promise<Diagram> {
  return invoke(SAVE_SPEC_DIAGRAM_RAW_PLANTUML_CMD, {
    rawPlantuml,
    diagramSpec,
    diagramName,
    diagramType,
  })
}

export async function exportDiagramToFile(
  diagramName: string,
  diagramType: DiagramType,
  diagramDataUrl: string,
  format: DiagramFormat,
): Promise<string> {
  return invoke(EXPORT_DIAGRAM_TO_FILE_CMD, {
    diagramDataUrl,
    format,
    diagramName,
    diagramType,
  })
}

export async function generatePlantUMLWithAI(
  description: string,
): Promise<string> {
  return invoke(GENERATE_PLANTUML_CMD, {
    description,
  })
}

export async function parsedElementToPlantUML(
  parsedElement: DiagramElementType,
  elementLevel?: number,
): Promise<string> {
  return invoke(PARSED_ELEMENT_TO_PLANTUML_CMD, {
    parsedElement,
    elementLevel: elementLevel ?? 0,
  })
}

export async function diagramToLinkString(
  diagramHumanName: string,
  diagramType: DiagramType,
): Promise<string> {
  return invoke(DIAGRAM_TO_LINK_STRING_CMD, {
    diagramHumanName,
    diagramType,
  })
}

export async function diagramNameTypeFromLinkString(
  linkString: string,
): Promise<Diagram> {
  return invoke(DIAGRAM_FROM_LINK_STRING_CMD, {
    linkString,
  })
}

export async function deserializePlantUMLByString(
  rawPlantuml: string,
): Promise<DiagramPlantUML> {
  return invoke(DESERIALIZE_PLANTUML_BY_STRING_CMD, {
    rawPlantuml,
  })
}

export async function diagramNameTypeFromPath(path: string): Promise<Diagram> {
  return invoke(DIAGRAM_NAME_TYPE_FROM_PATH_CMD, {
    path,
  })
}

export async function dependentElementsInDiagram(
  alias: string,
  diagramName: string,
  diagramType: DiagramType,
): Promise<string[]> {
  return invoke(DEPENDENT_ELEMENTS_IN_DIAGRAM_CMD, {
    alias,
    diagramName,
    diagramType,
  })
}

/*########################*/
/*    LIBRARY COMMANDS    */
/*########################*/
export const LIST_LIBRARY_ELEMENTS_CMD = 'list_library_elements'
export const CREATE_LIBRARY_ELEMENT_CMD = 'create_library_element'
export const UPDATE_LIBRARY_ELEMENT_CMD = 'update_library_element'
export const DELETE_LIBRARY_ELEMENT_CMD = 'delete_library_element'
export const LIBRARY_ELEMENT_TYPE_FROM_PATH_CMD =
  'library_element_type_from_path'

export async function listLibraryElements(
  filterC4ElementType: C4ElementType,
): Promise<C4Elements> {
  return invoke(LIST_LIBRARY_ELEMENTS_CMD, { filterC4ElementType })
}

export async function createLibraryElement(
  diagramElement: DiagramElementType,
): Promise<ProjectLibrary> {
  return invoke(CREATE_LIBRARY_ELEMENT_CMD, { diagramElement })
}

export async function updateLibraryElement(
  oldDiagramElement: DiagramElementType,
  newDiagramElement: DiagramElementType,
): Promise<ProjectLibrary> {
  return invoke(UPDATE_LIBRARY_ELEMENT_CMD, {
    oldDiagramElement,
    newDiagramElement,
  })
}

export async function deleteLibraryElement(
  uuidElement: string,
  elementType: C4ElementType,
): Promise<C4Elements> {
  return invoke(DELETE_LIBRARY_ELEMENT_CMD, { uuidElement, elementType })
}

export async function libraryElementTypeFromPath(
  path: string,
): Promise<C4ElementType> {
  return invoke(LIBRARY_ELEMENT_TYPE_FROM_PATH_CMD, { path })
}

/*########################*/
/*      HOOKS COMMANDS    */
/*########################*/
export const EXECUTE_HOOK_CMD = 'execute_hook'

export async function executeHook(payload: HookPayload): Promise<boolean> {
  return invoke('execute_hook', { payload })
}
