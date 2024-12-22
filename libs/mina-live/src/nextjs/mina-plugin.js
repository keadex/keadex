const CopyPlugin = require('copy-webpack-plugin')

function withMinaLive(nextjsConfig) {
  return Object.assign({}, nextjsConfig, {
    webpack(config, options) {
      config.externals.push({ canvas: 'commonjs canvas' })
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

      if (typeof nextjsConfig.webpack === 'function') {
        return nextjsConfig.webpack(config, options)
      }

      return config
    },
  })
}

module.exports = withMinaLive
