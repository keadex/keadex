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
export async function createProject(
  projectSettings: ProjectSettings,
): Promise<ProjectSettings> {
  return invoke('create_project', { projectSettings })
}

export async function openProject(root: string): Promise<Project> {
  return invoke('open_project', { root })
}

export async function closeProject(root: string): Promise<boolean> {
  return invoke('close_project', { root })
}

export async function saveProjectSettings(
  projectSettings: ProjectSettings,
): Promise<ProjectSettings> {
  return invoke('save_project_settings', { projectSettings })
}

/*########################*/
/*     SEARCH COMMANDS    */
/*########################*/
export async function search(
  stringToSearch: string,
  includeDiagramsDir: boolean,
  includeLibraryDir: boolean,
  limit: number,
): Promise<FileSearchResults> {
  return invoke('search', {
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
  return invoke('search_diagram_element_alias', {
    alias,
    includeDiagramsDir,
    includeLibraryDir,
    limit,
  })
}

/*########################*/
/*   DIAGRAMS COMMANDS    */
/*########################*/
export async function listDiagrams(): Promise<{
  [key in DiagramType]: string[]
}> {
  return invoke('list_diagrams')
}

export async function getDiagram(
  diagramName: string,
  diagramType: DiagramType,
): Promise<Diagram> {
  return invoke('get_diagram', { diagramName, diagramType })
}

export async function loadDiagram(
  diagramName: string,
  diagramType: DiagramType,
): Promise<Diagram> {
  return invoke('open_diagram', {
    diagramName,
    diagramType,
  })
}

export async function closeDiagram(
  diagramName: string,
  diagramType: DiagramType,
): Promise<Diagram> {
  return invoke('close_diagram', {
    diagramName,
    diagramType,
  })
}

export async function createDiagram(newDiagram: Diagram): Promise<boolean> {
  return invoke('create_diagram', {
    newDiagram,
  })
}

export async function deleteDiagram(
  diagramName: string,
  diagramType: DiagramType,
): Promise<ProjectLibrary> {
  return invoke('delete_diagram', {
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
  return invoke('save_spec_diagram_raw_plantuml', {
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
  return invoke('export_diagram_to_file', {
    diagramDataUrl,
    format,
    diagramName,
    diagramType,
  })
}

export async function generatePlantUMLWithAI(
  description: string,
): Promise<string> {
  return invoke('generate_plantuml', {
    description,
  })
}

export async function parsedElementToPlantUML(
  parsedElement: DiagramElementType,
  elementLevel?: number,
): Promise<string> {
  return invoke('parsed_element_to_plantuml', {
    parsedElement,
    elementLevel: elementLevel ?? 0,
  })
}

export async function diagramToLinkString(
  diagramHumanName: string,
  diagramType: DiagramType,
): Promise<string> {
  return invoke('diagram_to_link_string', {
    diagramHumanName,
    diagramType,
  })
}

export async function diagramNameTypeFromLinkString(
  linkString: string,
): Promise<Diagram> {
  return invoke('diagram_from_link_string', {
    linkString,
  })
}

export async function deserializePlantUMLByString(
  rawPlantuml: string,
): Promise<DiagramPlantUML> {
  return invoke('deserialize_plantuml_by_string', {
    rawPlantuml,
  })
}

export async function diagramNameTypeFromPath(path: string): Promise<Diagram> {
  return invoke('diagram_name_type_from_path', {
    path,
  })
}

/*########################*/
/*    LIBRARY COMMANDS    */
/*########################*/
export async function listLibraryElements(
  filterC4ElementType: C4ElementType,
): Promise<C4Elements> {
  return invoke('list_library_elements', { filterC4ElementType })
}

export async function createLibraryElement(
  diagramElement: DiagramElementType,
): Promise<ProjectLibrary> {
  return invoke('create_library_element', { diagramElement })
}

export async function updateLibraryElement(
  oldDiagramElement: DiagramElementType,
  newDiagramElement: DiagramElementType,
): Promise<ProjectLibrary> {
  return invoke('update_library_element', {
    oldDiagramElement,
    newDiagramElement,
  })
}

export async function deleteLibraryElement(
  uuidElement: string,
  elementType: C4ElementType,
): Promise<C4Elements> {
  return invoke('delete_library_element', { uuidElement, elementType })
}

export async function libraryElementTypeFromPath(
  path: string,
): Promise<C4ElementType> {
  return invoke('library_element_type_from_path', { path })
}

/*########################*/
/*      HOOKS COMMANDS    */
/*########################*/
export async function executeHook(payload: HookPayload): Promise<boolean> {
  return invoke('execute_hook', { payload })
}
