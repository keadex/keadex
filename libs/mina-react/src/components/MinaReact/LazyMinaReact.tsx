import { useEffect, useState } from 'react'
import { type MinaReactProps } from './MinaReact'

const Placeholder = () => null

export const LazyMinaReact = (props: MinaReactProps) => {
  // While the component is loading, we'll render a fallback placeholder.
  // (The Placeholder is a component that renders nothing).
  const [Component, setComponent] = useState<React.FC<MinaReactProps>>(
    () => Placeholder,
  )
  // After the initial render, kick off a dynamic import to fetch
  // the real component, and set it into our state.
  useEffect(() => {
    import('./MinaReact').then((MinaReact) =>
      setComponent(() => MinaReact.default),
    )
  }, [])
  return <Component {...props} />
}

export default LazyMinaReact
