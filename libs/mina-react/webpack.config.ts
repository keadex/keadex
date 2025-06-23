import { withReact } from '@nx/react'
import { composePlugins, withNx } from '@nx/webpack'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Configuration, optimize, DefinePlugin } from 'webpack'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

export const withNoNxSensitiveVars = () => (config) => {
  const NX_VARS = [
    'NX_TASK_HASH',
    'NX_TASK_TARGET_PROJECT',
    'NX_TASK_TARGET_TARGET',
    'NX_TERMINAL_OUTPUT_PATH',
    'NX_WORKSPACE_ROOT',
    'NX_CLOUD_ACCESS_TOKEN',
  ]
  config.plugins = config.plugins.map((plugin) => {
    if (!plugin.definitions || !plugin.definitions['process.env']) {
      return plugin
    }

    NX_VARS.forEach((nxVar) => {
      if (plugin.definitions['process.env'][nxVar]) {
        delete plugin.definitions['process.env'][nxVar]
      }
    })

    plugin.definitions['process.env']['NODE_ENV'] = JSON.stringify('production')

    return plugin
  })

  return config
}

export const withWebConfig = () => (defaultconfig) => {
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

    externals: [
      nodeExternals({
        allowlist: [/^@keadex/],
      }),
    ],

    optimization: {
      minimize: true,
    },

    plugins: [
      ...(defaultconfig.plugins ?? []),
      new optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new CopyPlugin({
        patterns: [
          { from: join(__dirname, 'package.json'), to: 'package.json' },
          { from: join(__dirname, 'README.md'), to: 'README.md' },
          {
            from: join(__dirname, 'static/mina-react-logo.svg'),
            to: 'static/mina-react-logo.svg',
          },
        ],
      }),
      new DefinePlugin({
        'import.meta.env': {
          VITE_AI_ENABLED: JSON.stringify(true),
          VITE_WEB_MODE: JSON.stringify(true),
          VITE_APP_VERSION: JSON.stringify(
            JSON.parse(
              readFileSync(join(__dirname, '../../package.json')).toString(),
            ).version,
          ),
        },
      }),
    ],
  }

  return config
}
export default composePlugins(
  withNx(),
  withReact(),
  withNoNxSensitiveVars(),
  withWebConfig(),
)
