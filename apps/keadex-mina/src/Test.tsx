import { useState } from 'react'
import './Test.css'
import { invoke } from '@tauri-apps/api'

const ID_NOOP = 0
const ID_OP_SAVE_RAW_PLANTUML = 1
const ID_OP_SAVE_PARSED_PLANTUML = 2
const ID_OP_DELETE_LIBRARY_ELEMENT = 3
const ID_OP_SAVE_PROJECT_SETTINGS = 4
const DIAGRAM_TYPES = [
  'SYSTEM_CONTEXT',
  'CONTAINER',
  'COMPONENT',
  'SYSTEM_LANDSCATE',
  'DYNAMIC',
  'DEPLOYMENT',
]

function Test() {
  // ###############################################
  // #                  HELPERS                    #
  // ###############################################
  const options_diagram_types: any[] = []
  DIAGRAM_TYPES.forEach((diagram_type) => {
    options_diagram_types.push(
      <option value={diagram_type}>{diagram_type}</option>
    )
  })

  // ###############################################
  // #                    STATE                    #
  // ###############################################

  // ---------- COMMON STATE
  const [idOperation, setIdOperation] = useState(ID_NOOP)

  // ---------- TEST PROJECT STATE
  const [projectSettings, setProjectSettings] = useState('')
  const [projectLibrary, setProjectLibrary] = useState('')
  const [path, setPath] = useState(
    'C:\\Users\\Jack\\Documents\\Progetti\\Keadex\\SourceCode\\web-apps\\apps\\keadex-mina\\test-mina-project'
  )
  const [pathNewProject, setPathNewProject] = useState('')
  const [nameNewProject, setNameNewProject] = useState('')
  const [descriptionNewProject, setDescriptionNewProject] = useState('')
  const [versionNewProject, setVersionNewProject] = useState('')
  const [labelResultNewProject, setLabelResultNewProject] = useState('')

  // ---------- TEST DIAGRAM STATE
  const [diagramName, setDiagramName] = useState('Test Diagram')
  const [diagramType, setDiagramType] = useState('CONTAINER')
  const [parsedPlantuml, setParsedPlantuml] = useState('')
  const [rawPlantuml, setRawPlantuml] = useState('')
  const [labelDiagramUpdated, setLabelDiagramUpdated] = useState('-')
  const [labelDiagramCreatedDeleted, setLabelDiagramCreatedDeleted] =
    useState('')
  const [diagramNameToCreateDelete, setDiagramNameToCreateDelete] =
    useState('Test Diagram')
  const [diagramTypeToCreateDelete, setDiagramTypeToCreateDelete] =
    useState('CONTAINER')

  // ---------- TEST LIBRARY STATE
  const [UUIDElementToDelete, setUUIDElementToDelete] = useState('')
  const [typeElementToDelete, setTypeElementToDelete] = useState('')
  const [labelLibraryUpdated, setLabelLibraryUpdated] = useState('')

  // ###############################################
  // #             BACKEND SERVICES                #
  // ###############################################

  // ---------- TEST PROJECT SERVICES

  // --- Open Project
  const openProject = async () => {
    const result: any = await invoke('open_project', { root: path }).catch(
      (error) => setProjectSettings(JSON.stringify(error, null, 2))
    )
    if (result) {
      console.log('project opened')
      setProjectSettings(JSON.stringify(result.project_settings, null, 2))
      setProjectLibrary(
        JSON.stringify(result.project_library.elements, null, 2)
      )
    } else console.error('error opening the project')
  }

  // --- Close Project
  const closeProject = async () => {
    const result = await invoke('close_project', { root: path }).catch(
      (error) => {
        setProjectSettings(JSON.stringify(error, null, 2))
        setProjectLibrary(JSON.stringify(error, null, 2))
      }
    )
    if (result) {
      console.log('project closed')
      setProjectSettings('project closed')
      setProjectLibrary('project closed')
      setParsedPlantuml('project closed')
      setRawPlantuml('project closed')
      setLabelDiagramUpdated('-')
      setIdOperation(ID_NOOP)
    }
  }

  // --- Save Project Settings
  const saveProjectSettings = async () => {
    const result = await invoke('save_project_settings', {
      projectSettings: JSON.parse(projectSettings),
    }).catch((error) => {
      setProjectSettings(JSON.stringify(error, null, 2))
    })
    if (result) {
      setProjectSettings(JSON.stringify(result, null, 2))
      setIdOperation(ID_OP_SAVE_PROJECT_SETTINGS)
    }
  }

  // --- Create Project
  const createProject = async () => {
    const projectSettings = {
      name: nameNewProject,
      description: descriptionNewProject,
      version: versionNewProject,
    }
    const result = await invoke('create_project', {
      root: pathNewProject,
      projectSettings,
    }).catch((error) => {
      setLabelResultNewProject(JSON.stringify(error, null, 2))
    })
    if (result) setLabelResultNewProject('Project created')
  }

  // ---------- TEST DIAGRAM SERVICES

  // --- Load Diagram
  const loadDiagram = async () => {
    const result: any = await invoke('open_diagram', {
      diagramName,
      diagramType,
    }).catch((error) => {
      setParsedPlantuml(JSON.stringify(error, null, 2))
      setRawPlantuml(JSON.stringify(error, null, 2))
    })
    if (result) {
      console.log('diagram opened')
      setLabelDiagramUpdated('Diagram opened')
      const { raw_plantuml, ...resultNoRaw } = result
      setParsedPlantuml(JSON.stringify(resultNoRaw, null, 2))
      setRawPlantuml(raw_plantuml)
    } else console.error('error opening the diagram')
  }

  // --- Save Raw PlantUML Diagram
  const saveRawPlantUML = async () => {
    const result: any = await invoke('save_diagram_raw_plantuml', {
      rawPlantuml,
      diagramName,
      diagramType,
    }).catch((error) => {
      setParsedPlantuml(error.msg)
      setRawPlantuml(error.msg)
    })
    if (result) {
      console.log('raw plantuml of the diagram saved')
      setLabelDiagramUpdated('Raw PlantUML saved and Parsed PlantUML updated')
      setIdOperation(ID_OP_SAVE_RAW_PLANTUML)
      const { raw_plantuml, ...resultNoRaw } = result
      setParsedPlantuml(JSON.stringify(resultNoRaw, null, 2))
      setRawPlantuml(raw_plantuml)
    } else console.error('error saving raw plantuml of the diagram')
  }

  // --- Save Parsed PlantUML Diagram
  const saveParsedPlantUMLDiagram = async () => {
    const diagramPlantuml = JSON.parse(parsedPlantuml).diagram_plantuml
    const result: any = await invoke('save_diagram_parsed_plantuml', {
      diagramPlantuml,
      diagramName,
      diagramType,
    }).catch((error) => {
      setParsedPlantuml(JSON.stringify(error, null, 2))
      setRawPlantuml(JSON.stringify(error, null, 2))
    })
    if (result) {
      console.log('parsed diagram saved')
      setLabelDiagramUpdated('Parsed PlantUML saved and Raw PlantUML updated')
      setIdOperation(ID_OP_SAVE_PARSED_PLANTUML)
      const { raw_plantuml, ...resultNoRaw } = result
      setParsedPlantuml(JSON.stringify(resultNoRaw, null, 2))
      setRawPlantuml(raw_plantuml)
    } else console.error('error saving parsed diagram')
  }

  // --- Close Diagram
  const closeDiagram = async () => {
    const result = await invoke('close_diagram', {
      diagramName,
      diagramType,
    }).catch((error) => {
      setParsedPlantuml(JSON.stringify(error, null, 2))
      setRawPlantuml(JSON.stringify(error, null, 2))
    })
    if (result) {
      setIdOperation(ID_NOOP)
      setLabelDiagramUpdated('-')
      setLabelLibraryUpdated('-')
      setParsedPlantuml('diagram closed')
      setRawPlantuml('diagram closed')
    } else setParsedPlantuml('error closing the diagram')
  }

  const createDeleteDiagram = async (typeOperation: string) => {
    const command =
      typeOperation == 'CREATE' ? 'create_diagram' : 'delete_diagram'
    const result = await invoke(command, {
      diagramName: diagramNameToCreateDelete,
      diagramType: diagramTypeToCreateDelete,
    }).catch((error) => {
      setLabelDiagramCreatedDeleted(JSON.stringify(error, null, 2))
    })
    if (result)
      setLabelDiagramCreatedDeleted(`diagram ${typeOperation.toLowerCase()}d`)
    else setLabelDiagramCreatedDeleted(`error on ${command} command`)
  }

  // ---------- TEST LIBRARY SERVICES

  // --- Delete library element
  const deleteElementFromLibrary = async () => {
    const elementType: any = {}
    elementType[typeElementToDelete] = {
      base_data: {},
      sub_elements: [],
    }
    const result: any = await invoke('delete_library_element', {
      uuidElement: UUIDElementToDelete,
      elementType,
    }).catch((error) => {
      setProjectLibrary(JSON.stringify(error, null, 2))
    })
    if (result) {
      setLabelLibraryUpdated('library updated')
      setIdOperation(ID_OP_DELETE_LIBRARY_ELEMENT)
      setProjectLibrary(JSON.stringify(result.elements, null, 2))
    }
  }

  return (
    <div className="test">
      <h1>Keadex Mina test mode</h1>

      {/* ------------------ TEST CREATE PROJECT */}
      <h2>Create project</h2>
      <h3>{labelResultNewProject}</h3>
      <input
        type="text"
        placeholder="root"
        value={pathNewProject}
        onChange={(e) => {
          setPathNewProject(e.target.value)
        }}
        onFocus={() => setLabelResultNewProject('')}
      />
      <input
        type="text"
        placeholder="name"
        value={nameNewProject}
        onChange={(e) => {
          setNameNewProject(e.target.value)
        }}
        onFocus={() => setLabelResultNewProject('')}
      />
      <input
        type="text"
        placeholder="description"
        value={descriptionNewProject}
        onChange={(e) => {
          setDescriptionNewProject(e.target.value)
        }}
        onFocus={() => setLabelResultNewProject('')}
      />
      <input
        type="text"
        placeholder="version"
        value={versionNewProject}
        onChange={(e) => {
          setVersionNewProject(e.target.value)
        }}
        onFocus={() => setLabelResultNewProject('')}
      />
      <button className="align-horizontally" onClick={() => createProject()}>
        Create New Project
      </button>

      <hr className="rounded" />

      {/* ------------------ TEST LOAD PROJECT */}
      <h2>Load project</h2>
      <input
        type="text"
        placeholder="root"
        value={path}
        onChange={(e) => {
          setPath(e.target.value)
        }}
      />
      <h4>Project Settings</h4>
      <textarea
        value={projectSettings}
        onChange={(e) => setProjectSettings(e.target.value)}
        style={{ height: 100 }}
        onFocus={() => {
          setIdOperation(ID_NOOP)
        }}
        className={
          idOperation == ID_OP_SAVE_PROJECT_SETTINGS ? 'input-updated' : ''
        }
      />
      <h4>Project Library</h4>
      <textarea
        value={projectLibrary}
        disabled={true}
        style={{ height: 150 }}
        className={
          idOperation == ID_OP_DELETE_LIBRARY_ELEMENT ? 'input-updated' : ''
        }
        onFocus={() => {
          setIdOperation(ID_NOOP)
          setLabelLibraryUpdated('')
        }}
      />
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => openProject()}>Open project</button>
        <button onClick={() => closeProject()}>Close project</button>
        <button onClick={() => saveProjectSettings()}>
          Save Project Settings
        </button>
      </div>

      <hr className="rounded" />

      {/* ------------------ TEST CREATE/DELETE DIAGRAM */}
      <h2>Create/Delete Diagram</h2>
      <h3 style={{ color: 'green' }}>{labelDiagramCreatedDeleted}</h3>
      <input
        type="text"
        placeholder="Diagram's name"
        value={diagramNameToCreateDelete}
        onChange={(e) => {
          setDiagramNameToCreateDelete(e.target.value)
        }}
        onFocus={() => {
          setLabelDiagramCreatedDeleted('')
        }}
      />
      <select
        value={diagramTypeToCreateDelete}
        onChange={(e) => setDiagramTypeToCreateDelete(e.target.value)}
      >
        {options_diagram_types}
      </select>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => createDeleteDiagram('CREATE')}>Create</button>
        <button onClick={() => createDeleteDiagram('DELETE')}>Delete</button>
      </div>

      <hr className="rounded" />

      {/* ------------------ TEST LOAD/SAVE/CLOSE PLANTUML DIAGRAM */}
      <h2>Load/Save/Close PlantUML Diagram</h2>
      <h3 style={{ color: 'green' }}>{labelDiagramUpdated}</h3>
      <input
        type="text"
        placeholder="Diagram's name"
        value={diagramName}
        onChange={(e) => {
          setDiagramName(e.target.value)
        }}
      />
      <select
        value={diagramType}
        onChange={(e) => setDiagramType(e.target.value)}
      >
        {options_diagram_types}
      </select>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => loadDiagram()}>Load diagram</button>
        <button onClick={() => closeDiagram()}>Close diagram</button>
      </div>

      <h4 style={{ marginTop: '50px' }}>Raw PlantUML</h4>
      <textarea
        value={rawPlantuml}
        style={{ height: 150 }}
        className={
          idOperation == ID_OP_SAVE_PARSED_PLANTUML ? 'input-updated' : ''
        }
        onChange={(event) => setRawPlantuml(event.target.value)}
        onFocus={() => {
          setIdOperation(ID_NOOP)
          setLabelDiagramUpdated('')
        }}
      />
      <button className="align-horizontally" onClick={() => saveRawPlantUML()}>
        Save raw PlantUML
      </button>

      <h4 style={{ marginTop: '50px' }}>Parsed PlantUML</h4>
      <textarea
        value={parsedPlantuml}
        style={{ height: 150 }}
        className={
          idOperation == ID_OP_SAVE_RAW_PLANTUML ? 'input-updated' : ''
        }
        onChange={(event) => setParsedPlantuml(event.target.value)}
        onFocus={() => {
          setIdOperation(ID_NOOP)
          setLabelDiagramUpdated('')
        }}
      />
      <button
        className="align-horizontally"
        onClick={() => saveParsedPlantUMLDiagram()}
      >
        Save parsed PlanUML
      </button>

      <hr className="rounded" />

      {/* ------------------ TEST REMOVE ELEMENT FROM LIBRARY */}
      <h2>Remove elements from the library</h2>
      <h3 style={{ color: 'green' }}>{labelLibraryUpdated}</h3>
      <div className="test-delete-library-element">
        <input
          type="text"
          value={UUIDElementToDelete}
          placeholder="UUID"
          onChange={(e) => {
            setUUIDElementToDelete(e.target.value)
          }}
          onFocus={() => {
            setLabelLibraryUpdated('')
            setIdOperation(ID_NOOP)
          }}
        />
        <select
          value={typeElementToDelete}
          onChange={(e) => setTypeElementToDelete(e.target.value)}
        >
          <option value="Boundary">Boundary</option>
          <option value="Container">Container</option>
          <option value="Component">Component</option>
          <option value="DeploymentNode">DeploymentNode</option>
          <option value="Person">Person</option>
          <option value="SoftwareSystem">SoftwareSystem</option>
        </select>
        <button onClick={() => deleteElementFromLibrary()}>Delete</button>
      </div>
    </div>
  )
}

export default Test
