/* eslint-disable @typescript-eslint/no-unused-vars */

import { LoadContext, Plugin } from '@docusaurus/types'
import { dirname, join } from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin')

function pluginMina({
  siteConfig: { themeConfig },
}: LoadContext): Plugin<void> {
  return {
    name: '@keadex/docusaurus-plugin-mina',
    configureWebpack(config, isServer) {
      const minaReactPath = dirname(
        require.resolve('@keadex/mina-react', {
          paths: [process.cwd()],
        }),
      )
      if (minaReactPath) {
        return {
          plugins: [
            new CopyPlugin({
              patterns: [
                {
                  context: minaReactPath,
                  from: '*.wasm',
                  to() {
                    return '[name][ext]'
                  },
                },
              ],
            }),
          ],
        }
      } else {
        throw new Error('Module @keadex/mina-react not found.')
      }
    },
  }
}

export default pluginMina
