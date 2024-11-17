import { Diagram, diagramTypeHumanName } from '@keadex/c4-model-ui-kit'
import { Tags } from '@keadex/keadex-ui-kit/cross'
import React from 'react'

export interface DiagramHeaderProps {
  tagsDirection: 'right' | 'bottom'
  scrollable: boolean
  diagram?: Diagram
  handleDiagramHeaderClick?: () => void
}

export const DiagramHeader = React.memo((props: DiagramHeaderProps) => {
  const { tagsDirection, scrollable, diagram, handleDiagramHeaderClick } = props

  function handleClick() {
    if (handleDiagramHeaderClick) handleDiagramHeaderClick()
  }

  return (
    diagram?.diagram_type && (
      <div
        className={`w-full flex flex-col items-center py-1 pr-3 ${
          handleDiagramHeaderClick ? 'cursor-pointer' : ''
        }`}
        onClick={handleClick}
      >
        <div
          className={`flex w-full my-auto ${
            tagsDirection === 'bottom' ? 'flex-col' : ''
          }`}
        >
          <div className="text-lg text-accent-primary grow truncate">
            {/* Cannot use i18next translation here, since this component will be available 
            also in react-mina, which currently does not support i18next */}
            {diagramTypeHumanName(diagram.diagram_type)} Diagram -{' '}
            {diagram.diagram_name}
          </div>
          {diagram.diagram_spec?.tags && (
            <div className={`${tagsDirection === 'bottom' ? 'mt-2 mb-5' : ''}`}>
              <Tags
                tags={diagram.diagram_spec.tags}
                className={`${
                  tagsDirection === 'right'
                    ? 'float-right top-1/2 -translate-y-1/2'
                    : ''
                }`}
              />
            </div>
          )}
        </div>
        {diagram.diagram_spec?.description && (
          <div
            className={`w-full text-sm whitespace-break-spaces ${
              scrollable ? '' : 'line-clamp-3'
            }`}
          >
            {diagram.diagram_spec?.description}
          </div>
        )}
      </div>
    )
  )
})

export default DiagramHeader
