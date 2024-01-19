import React from 'react'

export interface TagsProps {
  tags: string[] | JSX.Element[]
  className?: string
}

export const Tags = React.memo(({ tags, className }: TagsProps) => {
  return (
    <ul className={`tags ${className ?? ''}`}>
      {tags.map((tag, index) => (
        <li key={index}>{tag}</li>
      ))}
    </ul>
  )
})

export default Tags
