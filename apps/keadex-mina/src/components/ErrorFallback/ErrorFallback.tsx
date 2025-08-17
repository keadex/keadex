import { faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@keadex/keadex-ui-kit/cross'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const ErrorFallback = React.memo(
  ({
    error,
    resetErrorBoundary,
  }: {
    error: Error
    resetErrorBoundary: () => void
  }) => {
    const { t } = useTranslation()
    return (
      <div
        className={`absolute flex h-full w-full flex-col justify-center bg-primary`}
      >
        <div className="mx-auto flex flex-row">
          <div className="flex items-center mr-10">
            <FontAwesomeIcon icon={faFaceFrownOpen} className="text-6xl" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {t('error_fallback.title')}
            </div>
            <div className="text-xl mt-5">
              {t('error_fallback.description')}
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            location.reload()
          }}
          className="w-52 mt-16 mx-auto"
        >
          {t('common.restart')}
        </Button>
      </div>
    )
  },
)

export default ErrorFallback
