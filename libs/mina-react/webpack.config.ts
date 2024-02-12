import { withReact } from '@nx/react'
import { composePlugins, withNx } from '@nx/webpack'
import { join } from 'path'
import { Configuration } from 'webpack'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

export default composePlugins(withNx(), withReact(), (defaultconfig) => {
  const config: Configuration = {
    entry: path.resolve(__dirname, 'index.ts'),
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'index.js',
      libraryTarget: 'commonjs-module',
      library: {
        type: 'module',
      },
    },

    mode: defaultconfig.mode,
    target: defaultconfig.target,

    devtool: defaultconfig.devtool,

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      fallback: {
        util: false,
        path: false,
      },
    },

    module: defaultconfig.module,

    experiments: {
      asyncWebAssembly: true,
    },

    externals: [nodeExternals()],
    plugins: [
      ...(defaultconfig.plugins ?? []),
      new CopyPlugin({
        patterns: [
          { from: join(__dirname, 'package.json'), to: 'package.json' },
          { from: join(__dirname, 'README.md'), to: 'README.md' },
        ],
      }),
    ],
  }

  return config
})
