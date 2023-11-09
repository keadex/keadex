import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  C4ElementType,
  Component,
  Container,
  Person,
  SoftwareSystem,
} from '@keadex/c4-model-ui-kit'
import {
  Button,
  SearchButton,
  Table,
  TableColumn,
  TableData,
  TableOptions as TableOptionsComponent,
  useForceUpdate,
  useModal,
} from '@keadex/keadex-ui-kit/cross'
import {
  TableOptions,
  Table as TanStackTable,
  getCoreRowModel,
} from '@tanstack/react-table'
import pluralize from 'pluralize'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../core/store/hooks'
import { listLibraryElements } from '../../core/tauri-rust-bridge'
import { C4Elements } from '../../models/autogenerated/C4Elements'
import { MinaError } from '../../models/autogenerated/MinaError'
import { Project } from '../../models/autogenerated/Project'
import buildElementLibraryConfigs from './configs'
import menu from './table-options-menu'

export type LibraryElementType = Person | SoftwareSystem | Container | Component

export type ElementData = TableData<
  Partial<LibraryElementType> & {
    menu?: JSX.Element
  }
>

export interface LibraryElementProps {
  c4ElementType: C4ElementType
  pageSize?: number
  embedMode?: boolean
  onRowClick?: (
    e: React.MouseEvent<HTMLTableCellElement>,
    data: TableData<ElementData>,
  ) => void
}

export const LibraryElement = (props: LibraryElementProps) => {
  const { c4ElementType, pageSize, embedMode, onRowClick } = props

  const { t } = useTranslation()
  const { forceUpdate, updatedCounter } = useForceUpdate()
  const tableRef = useRef<TanStackTable<ElementData>>(null)
  const { modal, showModal, hideModal } = useModal()
  const project = useAppSelector((state) => state.project.value)

  const [data, setData] = useState<ElementData[]>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const elementLibraryConfigs = buildElementLibraryConfigs(c4ElementType, t)

  const columns: TableColumn<ElementData>[] = [
    {
      accessorKey: 'base_data.alias',
      label: t('common.alias'),
    },
    {
      accessorKey: 'base_data.label',
      label: t('common.label'),
    },
    {
      id: elementLibraryConfigs.typeColumnId,
      accessorFn: elementLibraryConfigs.typeAccessorFn,
      label: t('common.type'),
    },
    {
      accessorKey: 'base_data.description',
      label: t('common.description'),
    },
  ]
  if (!embedMode) {
    columns.push({
      accessorKey: 'menu',
      label: '',
    })
  }
  if (c4ElementType === 'Component' || c4ElementType === 'Container') {
    columns.splice(2, 0, {
      accessorKey: 'technology',
      label: t('common.technology'),
    })
  }

  const tableOptions: TableOptions<ElementData> = {
    data,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
  }

  useEffect(() => {
    // Retrieve data
    listLibraryElements(c4ElementType)
      .then((element: C4Elements) => {
        setData(
          element[elementLibraryConfigs.accessor].map((libraryElement) => {
            return {
              ...libraryElement,
              menu: (
                <TableOptionsComponent
                  menuOptions={
                    menu(
                      t,
                      c4ElementType,
                      libraryElement,
                      project,
                      openLibraryElement,
                      showModal,
                      hideModal,
                      forceUpdate,
                    ).menuItemsProps
                  }
                />
              ),
            }
          }),
        )
        tableRef.current?.setPageSize(
          pageSize !== undefined
            ? pageSize
            : element[elementLibraryConfigs.accessor].length,
        )
      })
      .catch((error: MinaError) => {
        toast.error(
          t('common.error.internal', { errorMessage: error.msg ?? error }),
        )
      })
  }, [t, updatedCounter, c4ElementType, pageSize])

  function openLibraryElement(
    mode: 'c' | 'u',
    libraryElement: LibraryElementType | undefined,
    project: Project | undefined,
    enableEdit = false,
  ) {
    let title = ''
    switch (mode) {
      case 'c':
        title = `${t('common.new')} ${t(
          `common.${elementLibraryConfigs.i18nKey}`,
        )}`
        break
      case 'u':
        title = `${t('common.edit')} ${t(
          `common.${elementLibraryConfigs.i18nKey}`,
        )}`
        break
    }

    showModal({
      id: `${c4ElementType.toLowerCase()}Modal`,
      title,
      body: (
        <elementLibraryConfigs.modal
          enableEdit={enableEdit}
          project={project}
          libraryElement={libraryElement}
          hideModal={hideModal}
          forceUpdate={forceUpdate}
        />
      ),
      buttons: false,
    })
  }

  return (
    <div className="h-full w-full p-3">
      {modal}
      <div className="flex items-center">
        <div
          className={`text-accent-primary inline-block text-2xl font-bold pointer-events-none ${
            embedMode ? 'hidden' : ''
          }`}
        >
          {pluralize(t(`common.${elementLibraryConfigs.i18nKey}`))}
        </div>
        <div className={`${embedMode ? 'w-full' : 'ml-5 w-64'} inline-block`}>
          <SearchButton onChange={(e) => setGlobalFilter(e.target.value)} />
        </div>
        <div className={`flex-grow ${embedMode ? 'hidden' : ''}`}>
          <Button
            className="float-right bg-red-400"
            onClick={() => {
              openLibraryElement('c', undefined, project, true)
            }}
          >
            <span>
              <FontAwesomeIcon icon={faPlus} />
            </span>
            <span className="ml-1">{`${t('common.create')} ${t(
              `common.${elementLibraryConfigs.i18nKey}`,
            )}`}</span>
          </Button>
        </div>
      </div>
      <div className="home-project w-full pb-4 pt-4">
        <Table
          ref={tableRef}
          defaultExpanded
          disableExpandControls
          columns={columns}
          tableOptions={tableOptions}
          globalFilter={globalFilter}
          hidePaginationControls={pageSize !== undefined ? false : true}
          expandable={false}
          onRowClick={(e, data: ElementData) => {
            if (onRowClick) {
              onRowClick(e, data)
            } else {
              const { menu, ...libraryElement } = data
              openLibraryElement(
                'u',
                libraryElement as LibraryElementType,
                project,
                true,
              )
            }
          }}
          suppressRowClickColIDs={['menu']}
        />
      </div>
    </div>
  )
}

export default LibraryElement
