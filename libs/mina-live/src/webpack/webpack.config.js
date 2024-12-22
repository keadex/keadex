// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin')

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
