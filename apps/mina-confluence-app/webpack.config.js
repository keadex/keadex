const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')
const { DefinePlugin } = require('webpack')
const { readFileSync } = require('fs')
const { join } = require('path')

module.exports = composePlugins(withNx(), withReact(), (config) => {
  config.experiments.asyncWebAssembly = true
  config.output.clean = true
  config.plugins = [
    ...(config.plugins ?? []),
    new DefinePlugin({
      'import.meta.env': {
        VITE_AI_ENABLED: JSON.stringify(true),
        VITE_WEB_MODE: JSON.stringify(true),
        VITE_APP_VERSION: JSON.stringify(
          JSON.parse(readFileSync(join(__dirname, 'package.json')).toString())
            .version,
        ),
        VITE_GITHUB_CLIENT_ID_MINA: JSON.stringify('N/A'), // Not used in this app
      },
    }),
  ]
  config.optimization.minimizer[2].options.exclude = (resource) => {
    // Following is required because Atlassian Forge is not compatible with Tailwind v4 and the optimization process strips out the CSS classes.
    return /main/.test(resource)
  }
  return config
})
