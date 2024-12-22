const { withMinaLiveWebpackConfig } = require('../webpack/webpack.config')

function withMinaLive(nextjsConfig) {
  return Object.assign({}, nextjsConfig, {
    webpack(config, options) {
      withMinaLiveWebpackConfig(config)

      if (typeof nextjsConfig.webpack === 'function') {
        return nextjsConfig.webpack(config, options)
      }

      return config
    },
  })
}

module.exports = withMinaLive
