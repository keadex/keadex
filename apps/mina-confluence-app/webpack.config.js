const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')

module.exports = composePlugins(withNx(), withReact(), (config) => {
  config.experiments.asyncWebAssembly = true
  config.resolve.fallback = {
    util: false,
    path: false,
  }

  // https://stackoverflow.com/questions/70599784/failed-to-parse-source-map
  // https://github.com/facebook/create-react-app/pull/11752
  config.ignoreWarnings.push(
    // Ignore warnings raised by source-map-loader.
    // some third party packages may ship miss-configured sourcemaps, that interrupts the build
    // See: https://github.com/facebook/create-react-app/discussions/11278#discussioncomment-1780169
    /**
     *
     * @param {import('webpack').WebpackError} warning
     * @returns {boolean}
     */
    (warning) => {
      return (
        warning.module &&
        warning.module.resource.includes('node_modules') &&
        warning.details &&
        warning.details.includes('source-map-loader')
      )
    },
  )

  return config
})
