import React, { Ref, forwardRef, useImperativeHandle } from 'react'
import {
  ColumnDef,
  ExpandedState,
  TableOptions,
  flexRender,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  Table as TanStackTable,
  AccessorFn,
} from '@tanstack/react-table'
import Header from './Header'
import Cell from './Cell'
import { useTranslation } from 'react-i18next'
import IconButton from '../IconButton/IconButton'
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from '@fortawesome/free-solid-svg-icons'

export interface TableColumn<T> {
  accessorKey?: string
  id?: string
  accessorFn?: AccessorFn<T, unknown>
  label: string
  size?: number | string
  className?: string
  enableResizing?: boolean
}

export type TableData<T> = {
  [P in keyof T]: T[P]
} & {
  children?: T[]
}

export interface TableProps<T extends TableData<T>> {
  columns: TableColumn<T>[]
  tableOptions: TableOptions<T>
  globalFilter: string
  hideHeader?: boolean
  disableExpandControls?: boolean
  defaultExpanded?: ExpandedState
  headerClassName?: string
  cellClassName?: string
  hidePaginationControls?: boolean
  expandable?: boolean
  onRowClick?: (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    data: T,
  ) => void
  suppressRowClickColIDs?: string[]
}

export const Table = forwardRef(
  <T extends TableData<T>>(
    props: TableProps<T>,
    ref: Ref<TanStackTable<T>>,
  ) => {
    const {
      tableOptions,
      columns,
      globalFilter,
      hideHeader,
      disableExpandControls,
      defaultExpanded,
      headerClassName,
      cellClassName,
      hidePaginationControls,
    } = props

    const { t } = useTranslation()

    let { expandable } = props

    if (expandable === undefined) expandable = true

    const [expanded, setExpanded] = React.useState<ExpandedState>(
      defaultExpanded !== undefined ? defaultExpanded : {},
    )

    const fullColumns = () => {
      const result: ColumnDef<T>[] = []
      columns.forEach((column) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const accessor: any = {}
        if (column.accessorKey) {
          accessor.accessorKey = column.accessorKey
        } else if (column.id) {
          accessor.id = column.id
          accessor.accessorFn = column.accessorFn
        }
        result.push({
          ...accessor,
          size: column.size,
          enableResizing: column.enableResizing,
          header: (props) =>
            !hideHeader ? (
              <Header
                {...props}
                className={`${headerClassName}`}
                label={column.label}
                disableExpandControls={disableExpandControls}
              />
            ) : (
              ''
            ),
          cell: (props) => (
            <Cell
              {...props}
              disableExpandControls={disableExpandControls}
              className={`${cellClassName ?? ''} ${column.className ?? ''}`}
            />
          ),
          footer: (props) => props.column.id,
        })
      })
      return result
    }

    const table = useReactTable({
      state: {
        expanded,
        globalFilter,
      },
      onExpandedChange: setExpanded,
      getSubRows: (row) => row.children,
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      debugTable: true,
      filterFromLeafRows: true,
      // onGlobalFilterChange: setGlobalFilter,
      ...tableOptions,
      columns: fullColumns(),
    })

    useImperativeHandle(ref, () => table)

    return (
      <div className="w-full">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className={`bg-dark-brand1 text-base ${
                  hideHeader ? 'opacity-0' : ''
                }`}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="relative first:rounded-bl first:rounded-tl last:rounded-br last:rounded-tr"
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                      )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer ${
                            header.column.getIsResizing() ? 'isResizing' : ''
                          }`}
                        ></div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  // Hide the row when the table is expandable, the row cannot expand and the depth is 0.
                  // This is the case when you are searching in an expandable table and the only results
                  // are the headers, which have depth=0 and cannot expand (because they are results).
                  hidden={expandable && row.depth === 0 && !row.getCanExpand()}
                  key={row.id}
                  className={`${
                    !row.getCanExpand()
                      ? 'hover:bg-secondary container-link'
                      : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        onClick={(e) => {
                          if (
                            props.onRowClick &&
                            (!props.suppressRowClickColIDs ||
                              !props.suppressRowClickColIDs.includes(
                                cell.column.id,
                              ))
                          )
                            props.onRowClick(e, row.original)
                        }}
                        key={cell.id}
                        className="first:rounded-bl first:rounded-tl last:rounded-br last:rounded-tr"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div
          className={`mt-5 flex items-center gap-2 ${
            hidePaginationControls !== undefined && hidePaginationControls
              ? 'hidden'
              : ''
          }`}
        >
          <IconButton
            className="p-1"
            icon={faAnglesLeft}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          />
          <IconButton
            className="p-1"
            icon={faAngleLeft}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
          <IconButton
            className="p-1"
            icon={faAngleRight}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
          <IconButton
            className="p-1"
            icon={faAnglesRight}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          />
          <span className="flex items-center gap-1">
            <div>
              {t('table.current_page', {
                currentPage: table.getState().pagination.pageIndex + 1,
                totalPages: table.getPageCount(),
              })}
            </div>
          </span>
          <span className="flex items-center gap-1">
            | {t('table.go_to_page')}:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              min={1}
              max={table.getPageCount()}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                if (page >= 0 && page < table.getPageCount())
                  table.setPageIndex(page)
              }}
              className="w-16 rounded border p-1"
            />
          </span>
          {/* <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select> */}
        </div>
      </div>
    )
  },
)

export default Table
