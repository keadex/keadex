'use client'

import { objectsAreEqual } from '@keadex/keadex-utils'
import Tagify from '@yaireo/tagify'
import { memo, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export interface TagsInputProps {
  id: string
  tags: string[]
  label?: string
  className?: string
  disabled?: boolean
  settings?: Tagify.TagifySettings<Tagify.TagData>
}

export const TagsInput = memo(
  ({ id, tags, label, className, disabled, settings }: TagsInputProps) => {
    const [tagifiedInput, setTagifiedInput] = useState<Tagify | undefined>()

    useEffect(() => {
      // the 'input' element which will be transformed into a Tagify component
      const inputElem = document.querySelector(`input[id=${id}]`) as
        | HTMLInputElement
        | undefined
      if (inputElem && !tagifiedInput) {
        setTagifiedInput(
          new Tagify(inputElem, {
            ...settings,
          }),
        )
      }
    }, [id])

    useEffect(() => {
      if (tagifiedInput) {
        const currentTags = tagifiedInput.value.map((value) => value.value)
        if (!objectsAreEqual(currentTags, tags)) {
          tagifiedInput.removeAllTags({ withoutChangeEvent: true })
          tagifiedInput.addTags(tags)
        }
      }
    }, [tagifiedInput, tags])

    return (
      <div className={twMerge(`relative`, className ?? '')}>
        {label && (
          <span className="input__label absolute left-3 top-0 mb-0 -translate-y-[1.1rem] scale-[0.9] pt-[0.37rem] leading-[1.6] drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] z-1">
            {label}
          </span>
        )}
        <input
          id={id}
          type="text"
          defaultValue={tags.join(',')}
          disabled={disabled}
        />
      </div>
    )
  },
)

export default TagsInput
