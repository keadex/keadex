import { faBook } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  C4_ELEMENTS_TYPES,
  c4ElementTypeHumanName,
  c4ElementTypePathName,
} from '@keadex/c4-model-ui-kit'
import { useSafeExit } from '@keadex/keadex-ui-kit/cross'
import pluralize from 'pluralize'
import type { JSX } from 'react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

import ROUTES, { BASE_PATH_LIBRARY } from '../../../../core/router/routes'

export const LibraryPanel = memo(() => {
  const { t } = useTranslation()
  const location = useLocation()
  const { modal: modalSafeExit, safeExit } = useSafeExit(ROUTES)

  function renderC4ElementsTypes(): JSX.Element[] {
    const elements: JSX.Element[] = C4_ELEMENTS_TYPES.map((c4ElementType) => {
      return (
        <li
          className={twMerge(
            `pl-2`,
            location.pathname ===
              `${BASE_PATH_LIBRARY}${c4ElementTypePathName(c4ElementType)}`
              ? 'active'
              : '',
          )}
          key={c4ElementType}
          onClick={() =>
            safeExit(
              `${BASE_PATH_LIBRARY}${c4ElementTypePathName(c4ElementType)}`,
            )
          }
        >
          {pluralize(c4ElementTypeHumanName(c4ElementType))}
        </li>
      )
    })
    return elements
  }

  return (
    <div className="flex flex-col">
      {modalSafeExit}
      <div className="p-4 text-center">
        <div className="text-brand1 mt-4 text-4xl">
          <FontAwesomeIcon icon={faBook} />
        </div>
        <div className="text-accent-primary mt-2 text-lg font-bold pointer-events-none">
          {t('common.library')}
        </div>
      </div>
      <ul className="mt-3">{renderC4ElementsTypes()}</ul>
    </div>
  )
})

export default LibraryPanel
