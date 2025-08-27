const CopyPlugin = require('copy-webpack-plugin')
const { relative } = eval('require')('path')

/**
 * @typedef {Object} MinaLiveWebpackOptions
 * @property {String | undefined} minaLivePackageAlias
 * @property {boolean | undefined} isNextJsConfig
 */

/**
 * Returns the webpack configuration to use Mina Live
 * @param {MinaLiveWebpackOptions | undefined} options
 * @returns
 */
function withMinaLiveWebpackConfig(options) {
  let isNextJsConfig = false
  let minaLivePackageAlias = '@keadex/mina-live'
  if (options) {
    isNextJsConfig = options.isNextJsConfig
    minaLivePackageAlias = options.minaLivePackageAlias ?? minaLivePackageAlias
  }

  let minaLiveRoot = eval('require').resolve(minaLivePackageAlias)
  minaLiveRoot = minaLiveRoot.replace(/\\/g, '/').replace('/index.js', '')

  return function (config) {
    if (!config.plugins) config.plugins = []
    const patterns = []
    if (!isNextJsConfig) {
      patterns.push(
        {
          from: `${minaLiveRoot}/*.wasm`,
          to({ context, absoluteFilename }) {
            return 'static/js/[name][ext]'
          },
        },
        {
          from: `${minaLiveRoot}/mina_live_worker_wasm.js`,
          to({ context, absoluteFilename }) {
            return 'static/js/[name][ext]'
          },
        },
        {
          from: `${minaLiveRoot}/static/keadex-mina/locales`,
          to({ context, absoluteFilename }) {
            return '_next/static/keadex-mina/locales'
          },
        },
        {
          from: `${minaLiveRoot}/static/keadex-mina/**/*`,
          globOptions: {
            ignore: ['**/locales'],
          },
          to({ context, absoluteFilename }) {
            return `${relative(
              `${minaLiveRoot}/static/keadex-mina/`,
              absoluteFilename,
            )}`
          },
        },
      )

      // Create React App does not support .cjs files: https://github.com/facebook/create-react-app/issues/12700
      config.module = {
        ...config.module,
        rules: config.module.rules.map((rule) => {
          if (rule.oneOf instanceof Array) {
            // eslint-disable-next-line no-param-reassign
            rule.oneOf[rule.oneOf.length - 1].exclude = [
              /\.(js|mjs|jsx|cjs|ts|tsx)$/,
              /\.html$/,
              /\.json$/,
            ]
          }
          return rule
        }),
      }
    } else {
      patterns.push(
        {
          from: `${minaLiveRoot}/*.wasm`,
          to({ context, absoluteFilename }) {
            return 'static/chunks/[name][ext]'
          },
        },
        {
          from: `${minaLiveRoot}/mina_live_worker_wasm.js`,
          to({ context, absoluteFilename }) {
            return 'static/chunks/[name][ext]'
          },
        },
        {
          from: `${minaLiveRoot}/static/keadex-mina/**/*`,
          to({ context, absoluteFilename }) {
            return `static/keadex-mina/${relative(
              `${minaLiveRoot}/static/keadex-mina/`,
              absoluteFilename,
            )}`
          },
        },
      )
    }

    config.plugins.push(
      new CopyPlugin({
        patterns,
      }),
    )

    return config
  }
}

module.exports = {
  withMinaLiveWebpackConfig,
}
