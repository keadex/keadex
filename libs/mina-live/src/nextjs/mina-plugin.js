const { withMinaLiveWebpackConfig } = require('../webpack/webpack.config')

function withMinaLive(nextjsConfig) {
  return Object.assign({}, nextjsConfig, {
    webpack(config, options) {
      withMinaLiveWebpackConfig(config)

      // Use the client static directory in the server bundle and prod mode
      // Fixes `Error occurred prerendering page "/"`
      // config.output.webassemblyModuleFilename =
      //   options.isServer && !options.dev
      //     ? '../static/pkg/[modulehash].wasm'
      //     : 'static/pkg/[modulehash].wasm'
      if (!options.isServer) {
        config.output.environment = {
          ...config.output.environment,
          asyncFunction: true,
        }
      }

      if (typeof nextjsConfig.webpack === 'function') {
        return nextjsConfig.webpack(config, options)
      }

      return config
    },
  })
}

module.exports = withMinaLive
