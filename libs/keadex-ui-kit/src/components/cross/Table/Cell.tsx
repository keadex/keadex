import { CellContext } from '@tanstack/react-table'
import { TableData } from './Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { twMerge } from 'tailwind-merge'

export interface CellProps<T> extends CellContext<T, unknown> {
  disableExpandControls?: boolean
  className?: string
}

export const Cell = <T extends TableData<T>>(props: CellProps<T>) => {
  const { row, getValue, disableExpandControls, className } = props

  // Since rows are flattened by default,
  // we can use the row.depth property
  // and paddingLeft to visually indicate the depth
  // of the row
  const style = {
    ...(row.depth === 0 && !row.getCanExpand()
      ? {}
      : { paddingLeft: `${row.depth}rem` }),
  }

  return (
    <div
      className={twMerge(
        `p-2`,
        !row.getCanExpand() ? `${className ?? ''}` : 'pt-5',
      )}
      style={style}
    >
      {/* {`${row.depth} ${row.getCanExpand()}`} */}
      {row.getCanExpand() ? (
        <div>
          <button
            hidden={disableExpandControls === true}
            className="mr-2"
            {...{
              onClick: row.getToggleExpandedHandler(),
              style: { cursor: 'pointer' },
            }}
          >
            {row.getIsExpanded() ? (
              <FontAwesomeIcon icon={faChevronDown} />
            ) : (
              <FontAwesomeIcon icon={faChevronRight} />
            )}
          </button>
          <span className="text-accent-primary text-lg pointer-events-none">
            {getValue() as any}
          </span>
        </div>
      ) : (
        (getValue() as any)
      )}
    </div>
  )
}

export default Cell
