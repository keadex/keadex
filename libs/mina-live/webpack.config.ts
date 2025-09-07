import { withReact } from '@nx/react'
import { composePlugins, withNx } from '@nx/webpack'
import { join, resolve } from 'path'
import { Configuration, optimize, DefinePlugin } from 'webpack'
import { readFileSync } from 'fs'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const withNoNxSensitiveVars = () => (config) => {
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

export default composePlugins(
  withNx(),
  withReact(),
  withNoNxSensitiveVars(),
  (defaultconfig) => {
    const config: Configuration = {
      entry: {
        index: path.resolve(__dirname, 'index.ts'),
        'mina-live-middleware': path.resolve(
          __dirname,
          'src/nextjs/mina-live-middleware.ts',
        ),
        'mina-live-plugin': path.resolve(
          __dirname,
          'src/nextjs/mina-live-plugin.js',
        ),
      },
      output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        assetModuleFilename: (pathData, assetInfo) => {
          if (pathData.filename?.endsWith('.wasm')) {
            return 'mina_live_bg.wasm'
          }
          return '[hash][ext][query]'
        },
        libraryTarget: 'commonjs-module',
        library: {
          type: 'module',
        },
      },

      mode: defaultconfig.mode,
      target: defaultconfig.target,

      devtool: defaultconfig.devtool,

      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.wasm'],
        fallback: {
          util: false,
          path: false,
        },
        alias: {
          '@tauri-apps/api/webviewWindow': resolve(
            __dirname,
            './src/tauri/tauri-web-adapter.ts',
          ),
        },
      },

      module: defaultconfig.module,

      experiments: {
        asyncWebAssembly: true,
      },

      externals: [
        { canvas: 'commonjs canvas' },
        nodeExternals({
          allowlist: [/^@keadex/, '@tauri-apps/api/webviewWindow'],
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
              from: join(__dirname, 'static/mina-live-logo.svg'),
              to: 'static/mina-live-logo.svg',
            },
            {
              from: join(__dirname, './src/webpack/webpack.config.js'),
              to: 'webpack.config.js',
            },
            {
              from: join(__dirname, './src-rust/pkg/mina_live.js'),
              to: 'mina_live_worker_wasm.js',
            },
          ],
        }),
        new DefinePlugin({
          'import.meta.env': {
            VITE_AI_ENABLED: JSON.stringify(true),
            VITE_WEB_MODE: JSON.stringify(true),
            VITE_APP_VERSION: JSON.stringify(
              JSON.parse(
                readFileSync(join(__dirname, './package.json')).toString(),
              ).version,
            ),
          },
        }),
        new CopyPlugin({
          patterns: [
            {
              from: 'apps/keadex-mina/public/locales',
              to() {
                return 'static/keadex-mina/locales'
              },
            },
            {
              from: 'apps/keadex-mina/public/**/*.+(svg|png|jpeg|jpg)',

              to() {
                return 'static/keadex-mina/[name][ext]'
              },
            },
          ],
        }),
      ],
    }

    return config
  },
)
