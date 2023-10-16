import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Spinner from '../Spinner/Spinner'

export interface SearchButtonProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  fixedWidth?: boolean
  loading?: boolean
  onIconClick?: () => void
}

export const SearchButton = React.memo((props: SearchButtonProps) => {
  const { fixedWidth, loading, onIconClick, ...otherProps } = props
  const [value, setValue] = useState<string>()

  function isActive(): boolean {
    if (fixedWidth !== undefined && fixedWidth) {
      return true
    } else {
      return value !== undefined && value !== ''
    }
  }

  function handleIconClick(event: React.MouseEvent<SVGSVGElement>) {
    if (onIconClick) onIconClick()
  }

  return (
    <div className="search-button__box flex items-center">
      <div
        className={`search-button__container flex items-center ${
          isActive() ? 'active' : ''
        }`}
      >
        {(loading === undefined || !loading) && (
          <FontAwesomeIcon
            icon={faSearch}
            className="icon"
            onClick={handleIconClick}
          />
        )}
        {loading !== undefined && loading && (
          <Spinner className="icon !h-4 !w-4" />
        )}
        <input
          {...otherProps}
          type="search"
          id="search"
          onChange={(e) => {
            setValue(e.currentTarget.value)
            if (otherProps.onChange) otherProps.onChange(e)
          }}
        />
      </div>
    </div>
  )
})

export default SearchButton
