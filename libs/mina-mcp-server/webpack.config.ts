import { composePlugins, withNx } from '@nx/webpack'
import * as fs from 'fs'
import { join } from 'path'
import {
  BannerPlugin,
  Configuration,
  NormalModuleReplacementPlugin,
  optimize,
} from 'webpack'

const nodeExternals = require('webpack-node-externals')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

const distFolderMinaMCPServerMain = 'main'
const distFolderMinaMCPServerBinary = 'binary'

export default composePlugins(withNx(), (defaultconfig) => {
  // force delete dist folder before each build to prevent old files from remaining
  if (defaultconfig.output?.path) {
    if (fs.existsSync(defaultconfig.output.path)) {
      fs.rmSync(defaultconfig.output.path, { recursive: true, force: true })
    }
  }

  const config: Configuration = {
    entry: {
      mina: path.resolve(__dirname, './src-js/mina.ts'),
      index: path.resolve(__dirname, './src-js/index.ts'),
    },
    output: {
      ...defaultconfig.output,
      filename: (pathData) => {
        if (pathData.chunk?.name === 'index') {
          return path.join(distFolderMinaMCPServerMain, 'index.js') // index goes into dist/main/index.js
        } else {
          return path.join(distFolderMinaMCPServerBinary, '[name].js') // mina goes into dist/binary/mina.js
        }
      },
      library: {
        type: 'commonjs2',
      },
    },

    mode: defaultconfig.mode,
    target: 'node',

    devtool: defaultconfig.devtool,

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },

    module: {
      rules: [
        // Ignore CSS/SCSS files (web-only)
        {
          test: /\.(css|scss)$/,
          type: 'asset/inline',
        },
        ...(defaultconfig.module?.rules ?? []),
      ],
    },

    experiments: {
      asyncWebAssembly: true,
    },

    externals: [
      nodeExternals({
        allowlist: [/^@keadex/, /^tw-elements/],
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
      // Replace tw-elements with mock to prevent document errors in Node.js
      new NormalModuleReplacementPlugin(
        /^tw-elements$/,
        path.resolve(__dirname, './src-js/tw-elements-mock.js'),
      ),
      new BannerPlugin({
        banner: '#!/usr/bin/env node',
        raw: true, // insert as-is, not wrapped in a comment
        entryOnly: true, // only add to entry point, not every chunk
        test: /index/,
      }),
      new CopyPlugin({
        patterns: [
          {
            from: join(__dirname, 'package.json'),
            to: join(distFolderMinaMCPServerMain, 'package.json'),
          },
          {
            from: join(__dirname, 'README.md'),
            to: join(distFolderMinaMCPServerMain, 'README.md'),
          },
          {
            from: join(__dirname, 'static/mina-mcp-server-logo.svg'),
            to: join(
              distFolderMinaMCPServerMain,
              'static',
              'mina-mcp-server-logo.svg',
            ),
          },
          {
            from: join(__dirname, '../../apps/keadex-battisti/public/fonts'),
            to: join(distFolderMinaMCPServerBinary, 'fonts'),
          },
        ],
      }),
    ],
  }

  return config
})
