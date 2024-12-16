import React from 'react'
import '../../styles/index.css'

// eslint-disable-next-line @typescript-eslint/ban-types
export type SplashScreenProps = {}

export const SplashScreen = React.memo((props: SplashScreenProps) => {
  return (
    <div
      className={`absolute flex h-full w-full flex-col justify-center bg-primary`}
    >
      <div className="-mt-28 text-center">
        <img
          src="mina-logo-full.svg"
          width={650}
          alt="Keadex Mina Logo "
          className="inline-block pointer-events-none"
        />
      </div>
    </div>
  )
})

export default SplashScreen
