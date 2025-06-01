/* eslint-disable @typescript-eslint/no-unused-vars */

import { LoadContext, Plugin } from '@docusaurus/types'
import { dirname } from 'path'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin')

function pluginMina({
  siteConfig: { themeConfig },
}: LoadContext): Plugin<void> {
  return {
    name: '@keadex/docusaurus-plugin-mina',
    configureWebpack(config, isServer) {
      const newConfig: any = {}

      const minaReactPath = dirname(
        require.resolve('@keadex/mina-react', {
          paths: [process.cwd()],
        }),
      )

      if (minaReactPath) {
        newConfig.plugins = [
          new CopyPlugin({
            patterns: [
              {
                context: minaReactPath,
                from: '*.wasm',
                to() {
                  return `${
                    config.mode === 'production' ? 'assets/js/' : ''
                  }[name][ext]`
                },
              },
            ],
          }),
        ]
      } else {
        throw new Error('Module @keadex/mina-react not found.')
      }

      if (isServer) {
        if (!newConfig.externals) {
          newConfig.externals = []
        }
        newConfig.externals.push({ canvas: 'commonjs canvas' })
        newConfig.module = {
          rules: [
            {
              test: /\.node$/,
              loader: 'node-loader',
            },
          ],
        }
      }

      newConfig.experiments = {
        asyncWebAssembly: true,
      }

      return newConfig
    },
  }
}

export default pluginMina

// trigger
