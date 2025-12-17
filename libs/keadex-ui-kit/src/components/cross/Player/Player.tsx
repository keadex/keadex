'use client'

import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import type { ReactPlayerProps } from 'react-player/types'

export type PlayerProps = ReactPlayerProps

export const Player = (props: PlayerProps) => {
  const { src, controls, playing, muted, loop, ...rest } = props
  const [vimeoEmbedCode, setVimeoEmbedCode] = useState('')

  function buildVimeoUrl() {
    if (src) {
      return `${src}${src.includes('?') ? '' : '?'}&byline=0&portrait=0&playsinline=0&badge=0&title=0&player_id=0&app_id=58479&autopause=0&controls=${controls ? '1' : '0'}&autoplay=${playing ? '1' : '0'}&muted=${muted ? '1' : '0'}&loop=${loop ? '1' : '0'}&responsive=${props.config?.vimeo?.responsive ? '1' : '0'}&transparent=${props.config?.vimeo?.transparent === false ? '0' : '1'}`
    }
    return src
  }

  async function getVimeoEmbedCode() {
    if (src) {
      const oembed = await fetch(
        `https://vimeo.com/api/oembed.json?url=${buildVimeoUrl()}`,
      )
      const oembedData = await oembed.json()
      let html = oembedData.html
      if (!props.config?.vimeo?.responsive) {
        // Fix width and height only if not responsive
        html = oembedData.html
          .replace(/width="\d+"/, 'width="100%"')
          .replace(/height="\d+"/, 'height="100%"')
      }
      setVimeoEmbedCode(html)
    }
  }

  useEffect(() => {
    if (props.config?.vimeo) {
      getVimeoEmbedCode()
    }
  }, [src, controls, playing, muted, loop, props.config?.vimeo])

  if (props.config?.vimeo) {
    // if (false) {
    // Vimeo video do not work well with ReactPlayer, so we use iframe directly
    return (
      <div className="w-full h-full">
        {vimeoEmbedCode ? (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: vimeoEmbedCode }}
          />
        ) : null}
      </div>
    )
  } else {
    return <ReactPlayer {...props} />
  }
}

export default Player
