import { objectsAreEqual } from '@keadex/keadex-utils'
import React, { useEffect, useRef, useState } from 'react'
import { Collapse, Tooltip } from 'tw-elements'
import ReactHtmlParser from 'react-html-parser'

export type AccordionItem<T> = {
  header: string
  body: string
  parseHtmlBody?: boolean
  data: T
}

export type AccordionProps<T> = {
  id: string
  items: AccordionItem<T>[]
  showButtonTooltip?: boolean
  buttonIconPosition?: 'left' | 'right'
  className?: string
  onBodyClick?: (item: T) => void
}

export const Accordion = <T,>(props: AccordionProps<T>) => {
  const { id, items } = props

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [collapseList, setCollapseList] = useState<any[]>([])
  const currentItems = useRef<AccordionItem<T>[] | null>()

  if (!objectsAreEqual(currentItems.current, items)) {
    currentItems.current = items
  }

  useEffect(() => {
    const collapseElementList = [].slice.call(
      document.querySelectorAll(
        `#${id} [data-te-collapse-item][data-te-collapse-item]`,
      ),
    )

    if (collapseElementList && collapseElementList.length > 0) {
      setCollapseList(
        collapseElementList.map((collapseEl) => {
          console.log('new CollapseTE')
          return new Collapse(collapseEl, {
            toggle: false,
          })
        }),
      )
    }

    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll(`#${id} [data-te-toggle="tooltip"]`),
    )
    const tooltips = tooltipTriggerList.map(
      (tooltipTriggerEl) =>
        new Tooltip(tooltipTriggerEl, {
          trigger: 'hover',
        }),
    )

    return () => {
      tooltips.forEach((tooltip) => {
        tooltip.dispose()
      })
    }
  }, [currentItems.current])

  function handleBodyClick(
    e: React.MouseEvent<HTMLDivElement>,
    item: AccordionItem<T>,
  ) {
    if (props.onBodyClick) {
      props.onBodyClick(item.data)
    }
  }

  function renderItems(): JSX.Element[] {
    let renderedItems: JSX.Element[] = []
    if (items) {
      renderedItems = items.map((item, index) => {
        let tooltipData = {}
        if (props.showButtonTooltip !== undefined && props.showButtonTooltip) {
          tooltipData = {
            'data-te-toggle': 'tooltip',
            'data-te-placement': 'right',
            title: item.header,
          }
        }
        const headerElement = (
          <span className="overflow-hidden text-ellipsis whitespace-pre">
            {item.header}
          </span>
        )
        return (
          <div className={`bg-secondary`} key={`search-result-item-${index}`}>
            <h2 className="mb-0" id={`${id}-heading-${index}`}>
              <button
                className="accordion-button [&:not([data-te-collapse-collapsed])]:text-accent-primary bg-primary [&:not([data-te-collapse-collapsed])]:bg-primary text-accent-primary group relative flex w-full items-center border-0 px-5 py-4 text-left [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none "
                type="button"
                data-te-collapse-init
                data-te-collapse-collapsed
                data-te-target={`#${id}-collapse-${index}`}
                aria-expanded="false"
                aria-controls={`${id}-collapse-${index}`}
                onClick={() => collapseList[index]?.toggle()}
                {...tooltipData}
              >
                {props.buttonIconPosition === undefined ||
                props.buttonIconPosition === 'right'
                  ? headerElement
                  : ''}
                <span className="accordion-icon mx-1 h-5 w-5 rotate-[0deg] group-[[data-te-collapse-collapsed]]:rotate-[-90deg]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
                {props.buttonIconPosition !== undefined &&
                props.buttonIconPosition === 'left'
                  ? headerElement
                  : ''}
              </button>
            </h2>
            <div
              id={`${id}-collapse-${index}`}
              className="!visible hidden"
              data-te-collapse-item
              aria-labelledby={`${id}-heading-${index}`}
              data-te-parent={`#${id}`}
            >
              <div
                className={`accordion-body px-5 py-4 text-left ${
                  props.onBodyClick ? 'cursor-pointer' : ''
                }`}
                onClick={(e) => handleBodyClick(e, item)}
              >
                {item.parseHtmlBody !== undefined && item.parseHtmlBody
                  ? ReactHtmlParser(item.body)
                  : item.body}
              </div>
            </div>
          </div>
        )
      })
    }
    return renderedItems
  }

  return (
    <div id={id} className={`${props.className ?? ''}`}>
      {renderItems()}
    </div>
  )
}

export default Accordion
