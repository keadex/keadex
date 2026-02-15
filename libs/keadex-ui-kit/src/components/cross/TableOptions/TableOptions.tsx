import { memo } from 'react'

import { DropdownMenu } from '../DropdownMenu/DropdownMenu'
import { DropdownMenuItemProps } from '../DropdownMenu/DropdownMenuItem'

export interface TableOptionsProps {
  menuOptions: DropdownMenuItemProps[]
}

export const TableOptions = memo((props: TableOptionsProps) => {
  const { menuOptions } = props

  return (
    <div className="mr-3 text-right">
      <DropdownMenu menuItemsProps={menuOptions} />
    </div>
  )
})

export default TableOptions
