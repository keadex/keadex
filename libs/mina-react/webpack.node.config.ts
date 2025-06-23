import { composePlugins, withNx } from '@nx/webpack'
import { Configuration, optimize } from 'webpack'
import { withNoNxSensitiveVars, withWebConfig } from './webpack.config'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

export default composePlugins(
  withNx(),
  withNoNxSensitiveVars(),
  withWebConfig(),
  (defaultconfig) => {
    const config: Configuration = {
      entry: {
        core: path.resolve(__dirname, 'src/core/core.ts'),
      },
      output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        libraryTarget: 'module',
        library: {
          type: 'module',
        },
      },

      mode: defaultconfig.mode,
      target: 'node',

      devtool: defaultconfig.devtool,

      resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },

      module: defaultconfig.module,

      experiments: {
        asyncWebAssembly: true,
        outputModule: true,
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
      ],
    }

    return config
  },
)
