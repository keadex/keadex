const { ModuleFederationPlugin } = require('webpack').container
const deps = require('./package.json').dependencies
const docusaurusDeps = require('@docusaurus/core/package.json').dependencies
const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, `.env.${process.env.NODE_ENV}`),
})

module.exports = {
  title: 'Keadex',
  url: process.env.PUBLIC_URL,
  baseUrl: process.env.BASE_URL,
  staticDirectories: ['static'],
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'keadex',
  projectName: 'kadex-docs',
  onBrokenLinks: 'warn',
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
    },
    navbar: {
      items: [
        {
          label: 'Select a Keadex module',
          position: 'left',
          items: [
            {
              label: 'Keadex Mina',
              to: 'docs/keadex-mina/introduction',
              activeBaseRegex: 'docs/keadex-mina/*',
            },
          ],
        },
      ],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/keadex/web-apps/edit/main/apps/keadex-docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    () => ({
      configureWebpack(config, isServer, utils, content) {
        const newEntry = './apps/keadex-docs/src/index.tsx'
        if (!isServer) {
          // const appExposePath = config.entry.replace(config.entry.replace(/^.*[\\\/]/, ''), "App.js")
          return {
            entry: newEntry,
            optimization: {
              runtimeChunk: false,
            },
            output: {
              publicPath: `${process.env.PUBLIC_URL}${process.env.BASE_URL}`,
            },
            plugins: [
              ...config.plugins,
              new ModuleFederationPlugin({
                name: 'keadexdocs',
                filename: 'remoteEntry.js',
                exposes: {
                  './App': newEntry,
                },
                shared: [
                  {
                    react: {
                      singleton: true,
                      requiredVersion: deps.react,
                    },
                    'react-dom': {
                      singleton: true,
                      requiredVersion: deps['react-dom'],
                    },
                    'react-router': {
                      singleton: true,
                      requiredVersion: docusaurusDeps['react-router'],
                    },
                    'react-router-dom': {
                      singleton: true,
                      requiredVersion: docusaurusDeps['react-router-dom'],
                    },
                  },
                ],
              }),
            ],
          }
        } else {
          return {}
        }
      },
    }),
  ],
}
