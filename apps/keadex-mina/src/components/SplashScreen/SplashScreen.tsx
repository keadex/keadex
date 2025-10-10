import React from 'react'
import '../../styles/index.css'
import { useTranslation } from 'react-i18next'

// eslint-disable-next-line @typescript-eslint/ban-types
export type SplashScreenProps = {
  className?: string
  hideLogo?: boolean
  showLoading?: boolean
  label?: string
}

export const SplashScreen = React.memo((props: SplashScreenProps) => {
  const { className, showLoading, label, hideLogo } = props
  const { t } = useTranslation()

  return (
    <div
      className={`absolute flex h-full w-full flex-col justify-center bg-primary ${
        className ?? ''
      }`}
    >
      <div className="-mt-28 text-center">
        {!hideLogo && (
          <img
            src="mina-logo-full.svg"
            width={650}
            alt="Keadex Mina Logo "
            className="inline-block pointer-events-none"
          />
        )}
        {showLoading && (
          <div className="flex flex-row mt-10 text-center w-full justify-center">
            <div className="text-3xl mr-2 font-light">
              {label ?? `${t('common.loading')}`}
            </div>
            <div className="flex space-x-2 justify-center items-end pb-1">
              <div className="h-3 w-3 bg-brand1 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-3 w-3 bg-brand2 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-3 w-3 bg-brand3 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default SplashScreen
