import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

export interface NewsBannerProps {
  className?: string | JSX.Element
  content: string | JSX.Element
}

export const NewsBanner = React.memo(
  ({ className, content }: NewsBannerProps) => {
    const [hidden, setHidden] = useState(false)

    return (
      <div
        className={`w-full h-8 flex bg-brand1 text-accent-primary font-normal text-base relative ${
          hidden ? 'hidden' : ''
        } ${className ?? ''}`}
      >
        <div className="w-full text-center my-auto">{content}</div>
        <FontAwesomeIcon
          onClick={() => setHidden(true)}
          icon={faClose}
          size="sm"
          className="text-base absolute right-5 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 cursor-pointer"
        />
      </div>
    )
  },
)

export default NewsBanner
