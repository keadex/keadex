// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')

function withMinaLiveWebpackConfig(config) {
  if (!config.externals) config.externals = []
  if (!config.resolve) config.resolve = {}
  if (!config.plugins) config.plugins = []

  config.externals.push({
    canvas: 'commonjs canvas',
  })

  config.resolve.alias = {
    ...config.resolve.alias,
    '@tauri-apps/api/webviewWindow': require.resolve(
      '@keadex/mina-live/tauri-web-adapter',
    ),
  }
  config.resolve.extensions.push('.wasm')

  config.experiments = {
    ...config.experiments,
    asyncWebAssembly: true,
  }

  config.plugins.push(
    new DefinePlugin({
      'import.meta.env': {
        VITE_AI_ENABLED: JSON.stringify(true),
        VITE_WEB_MODE: JSON.stringify(true),
      },
    }),
  )
  config.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: '../keadex-mina/public/locales',
          to() {
            return 'static/keadex-mina/locales'
          },
        },
        {
          from: '../keadex-mina/public/**/*.+(svg|png|jpeg|jpg)',
          to() {
            return 'static/keadex-mina/[name][ext]'
          },
        },
      ],
    }),
  )

  return config
}

module.exports = {
  withMinaLiveWebpackConfig,
}
