import { useEffect, useState } from 'react'
import { type MinaLiveProps } from './MinaLive'

const Placeholder = () => null

export const LazyMinaLive = (props: MinaLiveProps) => {
  // While the component is loading, we'll render a fallback placeholder.
  // (The Placeholder is a component that renders nothing).
  const [Component, setComponent] = useState<React.FC<MinaLiveProps>>(
    () => Placeholder,
  )
  // After the initial render, kick off a dynamic import to fetch
  // the real component, and set it into our state.
  useEffect(() => {
    import('./MinaLive').then((MinaLive) =>
      setComponent(() => MinaLive.default),
    )
  }, [])
  return <Component {...props} />
}

export default LazyMinaLive
