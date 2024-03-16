const CopyPlugin = require('copy-webpack-plugin')

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  if (!config.plugins) config.plugins = []
  config.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: 'node_modules/@keadex/mina-react/*.wasm',
          to({ context, absoluteFilename }) {
            return 'static/js/[name][ext]'
          },
        },
      ],
    }),
  )

  return config
}