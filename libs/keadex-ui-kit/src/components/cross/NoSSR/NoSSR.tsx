import dynamic from 'next/dynamic'
import React, { PropsWithChildren } from 'react'

export const NoSSR = dynamic(
  () =>
    Promise.resolve((props: PropsWithChildren) => (
      <React.Fragment>{props.children}</React.Fragment>
    )),
  {
    ssr: false,
  },
)

export default NoSSR
