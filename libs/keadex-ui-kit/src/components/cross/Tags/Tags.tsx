import type { JSX } from 'react'
import { memo } from 'react'
import { twMerge } from 'tailwind-merge'

export interface TagsProps {
  tags: string[] | JSX.Element[]
  className?: string
}

export const Tags = memo(({ tags, className }: TagsProps) => {
  return (
    <ul className={twMerge(`tags`, className ?? '')}>
      {tags.map((tag, index) => (
        <li key={index}>{tag}</li>
      ))}
    </ul>
  )
})

export default Tags
