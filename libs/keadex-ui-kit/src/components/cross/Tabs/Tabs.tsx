'use client'

import type { JSX } from 'react'
import { memo, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export type Tab = {
  id: string
  title: string
  body: JSX.Element
}

export interface TabsProps {
  id?: string
  className?: string
  tabClassName?: string
  bodyClassName?: string
  orientation?: 'top' | 'left'
  tabs: Tab[]
}

export const Tabs = memo(
  ({
    id,
    tabs,
    tabClassName,
    bodyClassName,
    className,
    orientation,
  }: TabsProps) => {
    if (!orientation) orientation = 'top'

    const [selectedTabIndex, setSelectedTabIndex] = useState(-1)

    return (
      <div
        id={`${id ?? ''}`}
        className={twMerge(
          `flex`,
          orientation === 'top' ? 'flex-col' : 'flex-row',
          className ?? '',
        )}
      >
        {/* Tabs navigation */}
        <ul
          className={twMerge(
            `list-none`,
            orientation === 'top' ? 'flex flex-row flex-wrap' : 'block',
            `border-b-0 pl-0`,
          )}
          role="tablist"
          data-te-nav-ref
        >
          {tabs.map((tab, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const active: any = {}

            // By default select the first tab if no other tabs have been selected
            if (selectedTabIndex === -1 && index === 0)
              active['data-te-nav-active'] = {}

            return (
              <li
                role="presentation"
                className="flex-auto text-center"
                key={tab.id}
              >
                <a
                  href={`#${tab.id}`}
                  onClick={() => setSelectedTabIndex(index)}
                  className={twMerge(
                    `my-2 block border-x-0`,
                    orientation === 'top' ? 'border-b-2' : 'border-l-2',
                    `border-t-0 border-transparent px-7 pb-3.5 pt-4 font-medium leading-tight hover:isolate hover:border-transparent focus:isolate focus:border-transparent data-te-nav-active:border-link data-te-nav-active:text-white hover:text-white bg-primary hover:bg-link`,
                    tabClassName ?? '',
                  )}
                  data-te-toggle="pill"
                  data-te-target={`#${tab.id}`}
                  {...active}
                  role="tab"
                  aria-controls={`#${tab.id}`}
                  aria-selected="true"
                >
                  {tab.title}
                </a>
              </li>
            )
          })}
        </ul>
        {/* Tabs content */}
        <div className={twMerge(`p-4`, bodyClassName ?? '')}>
          {tabs.map((tab, index) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const active: any = {}

            // By default select the first tab if no other tabs have been selected
            if (selectedTabIndex === -1 && index === 0)
              active['data-te-tab-active'] = {}

            return (
              <div
                key={tab.id}
                className="hidden opacity-100 transition-opacity duration-150 ease-linear data-te-tab-active:block"
                id={tab.id}
                role="tabpanel"
                {...active}
                aria-labelledby={tab.id}
              >
                {tab.body}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)

export default Tabs
