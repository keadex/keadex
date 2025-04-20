const { withMinaLiveWebpackConfig } = require('../webpack/webpack.config')

/**
 * @typedef {Object} MinaLiveOptions
 * @property {String | undefined} minaLivePackageAlias
 */

/**
 * Returns the webpack configuration to use Mina Live
 * @param {MinaLiveOptions | undefined} minaLiveOptions
 * @returns
 */
function withMinaLive(minaLiveOptions) {
  let minaLivePackageAlias = '@keadex/mina-live'
  if (minaLiveOptions) {
    minaLivePackageAlias =
      minaLiveOptions.minaLivePackageAlias ?? minaLivePackageAlias
  }
  return function (nextjsConfig) {
    return Object.assign({}, nextjsConfig, {
      webpack(config, options) {
        config = withMinaLiveWebpackConfig({
          minaLivePackageAlias,
          isNextJsConfig: true,
        })(config)

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
}

module.exports = withMinaLive
