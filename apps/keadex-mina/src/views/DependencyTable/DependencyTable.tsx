import { faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DiagramType, diagramTypeHumanName } from '@keadex/c4-model-ui-kit'
import {
  Button,
  Input,
  Spinner,
  Table,
  TableColumn,
  TableData,
} from '@keadex/keadex-ui-kit/cross'
import {
  TableOptions,
  Table as TanStackTable,
  getCoreRowModel,
} from '@tanstack/react-table'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ALIAS_REGEX } from '../../constants/regex'
import { EDIT_DIAGRAM } from '../../core/router/routes'
import {
  diagramNameTypeFromPath,
  diagramToLinkString,
  dependentElementsInDiagram,
  searchDiagramElementAlias,
} from '../../core/tauri-rust-bridge'
import { generateDependencyTableDeepLink } from '../../helper/deep-link-helper'
import { MinaError } from '../../models/autogenerated/MinaError'
import { DiagramEditorState } from '../DiagramEditor/DiagramEditor'

export type DependencyTableParams = {
  alias: string
}

type Dependency = {
  name: string
  type: DiagramType
  humanType: string
  link: string
  dependents: string[]
}

type DependencyData = TableData<Partial<Dependency>>

// eslint-disable-next-line @typescript-eslint/ban-types
export type DependencyTableProps = {}

export const DependencyTable = (props: DependencyTableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { alias: aliasParam } = useParams<DependencyTableParams>()
  const [alias, setAlias] = useState(aliasParam ?? '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [dependencies, setDependencies] = useState<Dependency[] | undefined>()
  const tableRef = useRef<TanStackTable<DependencyData>>(null)

  const columns: TableColumn<DependencyData>[] = [
    {
      accessorKey: 'name',
      label: t('common.diagram_name'),
      size: 400,
      className: 'max-w-[400px] truncate',
      enableResizing: false,
    },
    {
      accessorKey: 'humanType',
      label: t('common.diagram_type'),
      size: 300,
      className: 'max-w-[300px] truncate',
      enableResizing: false,
    },
    {
      id: 'dependents',
      accessorFn: (data) => {
        return data.dependents?.join(', ')
      },
      label: t('common.dependent_elements'),
      className: 'text-ellipsis',
      enableResizing: false,
    },
  ]

  const tableOptions: TableOptions<DependencyData> = {
    data: dependencies ?? [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    pageCount: 1,
  }

  function isValidAlias() {
    return alias && alias.replace(/ /gi, '').length > 0
  }

  async function handleGenerateDepTableClick(alias: string) {
    setIsGenerating(true)
    searchDiagramElementAlias(alias, true, false, 10000)
      .then(async (results) => {
        setIsGenerating(false)
        if (results && results.count > 0) {
          const diagrams = []
          for (const diagramPath of Object.keys(results.results)) {
            const diagram = await diagramNameTypeFromPath(diagramPath)
            if (diagram.diagram_name && diagram.diagram_type) {
              const link = await diagramToLinkString(
                diagram.diagram_name,
                diagram.diagram_type,
              )
              const dependents = await dependentElementsInDiagram(
                alias,
                diagram.diagram_name,
                diagram.diagram_type,
              )
              diagrams.push({
                name: diagram.diagram_name,
                type: diagram.diagram_type,
                humanType: diagramTypeHumanName(diagram.diagram_type),
                link,
                dependents,
              })
            }
          }
          setDependencies(diagrams)
          tableRef.current?.setPageSize(diagrams.length)
        } else {
          setDependencies([])
        }
      })
      .catch((error: MinaError) => {
        console.error(error)
        setIsGenerating(false)
        setDependencies([])
        toast.error(
          t('dependency_table.dependencies_retrieval_error', {
            errorMessage: error.msg,
          }),
        )
      })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && isValidAlias()) {
      handleGenerateDepTableClick(alias)
    }
  }

  function handleShareDeepLink(alias: string) {
    const deepLink = generateDependencyTableDeepLink(alias)
    writeText(deepLink)
    toast.info(t('common.info.copied_to_clipboard'))
  }

  useEffect(() => {
    if (isValidAlias()) {
      handleGenerateDepTableClick(alias)
    }
  }, [])

  useEffect(() => {
    if (aliasParam) {
      setAlias(aliasParam)
      handleGenerateDepTableClick(aliasParam)
    }
  }, [aliasParam])

  return (
    <div className="w-full min-h-full p-3 flex flex-col">
      <div
        className={`text-accent-primary inline-block text-2xl font-bold pointer-events-none mt-2`}
      >
        {t('common.dependency_table')}
      </div>
      <div className="w-full mt-5">
        {t('dependency_table.description_feature')}
      </div>
      <div className="w-full mt-10 flex">
        <div className="w-96">
          <Input
            type="text"
            label={`${t('dependency_table.alias_hint')}`}
            className=""
            value={alias}
            allowedChars={ALIAS_REGEX}
            info={`${t('common.allowed_pattern')}: ${ALIAS_REGEX}`}
            onChange={(e) => setAlias(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          disabled={!isValidAlias()}
          className="ml-5 h-fit mt-1 w-60"
          onClick={() => handleGenerateDepTableClick(alias)}
        >
          {isGenerating ? (
            <Spinner className="icon !h-4 !w-4" />
          ) : (
            t('common.generate')
          )}
        </Button>
        <Button
          disabled={!isValidAlias()}
          className="ml-2 h-fit mt-1 w-60"
          onClick={() => handleShareDeepLink(alias)}
        >
          <FontAwesomeIcon icon={faShareNodes} />
          <span className="ml-2">{t('common.action.copy_deep_link')}</span>
        </Button>
      </div>
      {dependencies && dependencies.length > 0 && (
        <div className="w-full mt-10">
          <Table
            ref={tableRef}
            defaultExpanded
            disableExpandControls
            hidePaginationControls
            columns={columns}
            tableOptions={tableOptions}
            globalFilter={''}
            expandable={false}
            onRowClick={(e, data: DependencyData) => {
              if (data.name && data.type) {
                const state: DiagramEditorState = {
                  diagramName: data.name,
                  diagramType: data.type,
                }
                navigate(EDIT_DIAGRAM, { state })
              }
            }}
          />
        </div>
      )}
      {dependencies && dependencies.length === 0 && (
        <div className="w-full mt-10 text-center text-accent-primary">
          {t('dependency_table.no_dependencies_found')}
        </div>
      )}
    </div>
  )
}

export default DependencyTable
