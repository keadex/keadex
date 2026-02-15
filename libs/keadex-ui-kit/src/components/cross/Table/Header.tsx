import { HeaderContext } from '@tanstack/react-table'
import { TableData } from './Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { twMerge } from 'tailwind-merge'

export interface HeaderProps<T extends TableData<T>>
  extends HeaderContext<T, unknown> {
  label: string
  disableExpandControls?: boolean
  className?: string
}

export const Header = <T extends TableData<T>>(props: HeaderProps<T>) => {
  const { table, label, disableExpandControls, className } = props

  return (
    <div className={twMerge(className ?? '', `p-2`)}>
      <button
        hidden={disableExpandControls === true}
        {...{
          onClick: table.getToggleAllRowsExpandedHandler(),
        }}
      >
        {table.getIsAllRowsExpanded() ? (
          <FontAwesomeIcon icon={faChevronDown} />
        ) : (
          <FontAwesomeIcon icon={faChevronRight} />
        )}
      </button>{' '}
      {label}
    </div>
  )
}

export default Header
