//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next')
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
})
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const CopyPlugin = require('copy-webpack-plugin')
const withMinaLive = require('@keadex/mina-live-npm/nextjs-plugin')

const ALL_SOURCES = '/(.*)'
const MINA_LIVE_EDITOR_SOURCE = '/(.*)/mina-live'

/**
 * @param {string} source
 * @returns {string}
 */
const cspHeader = (source) => {
  let connectSrc = `'self' https://vercel.live https://consentcdn.cookiebot.com https://region1.google-analytics.com https://gist.githubusercontent.com https://raw.githubusercontent.com https://keadex.dev https://vimeo.com`

  if (source === MINA_LIVE_EDITOR_SOURCE) {
    connectSrc = '*'
  }

  return `
    default-src 'self';
    connect-src ${connectSrc};
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://consent.cookiebot.com https://consentcdn.cookiebot.com https://vercel.live https://www.googletagmanager.com https://player.vimeo.com;
    frame-src 'self' https://consentcdn.cookiebot.com https://vercel.live https://www.youtube.com https://player.vimeo.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://imgsct.cookiebot.com https://www.googletagmanager.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`.replace(/\n/g, '')
}

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      '@keadex/keadex-ui-kit/cross',
      '@keadex/keadex-ui-kit/web',
      '@keadex/keadex-utils',
    ],
    webpackBuildWorker: true,
  },
  transpilePackages: ['../../libs/keadex-ui-kit/src/web.ts'],
  async redirects() {
    return [
      {
        source: '/:lang/mina',
        destination: '/:lang/projects/keadex-mina',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: ALL_SOURCES,
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader(ALL_SOURCES),
          },
        ],
      },
      {
        source: MINA_LIVE_EDITOR_SOURCE,
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader(MINA_LIVE_EDITOR_SOURCE),
          },
        ],
      },
      {
        source: '/api/download-gh-raw-file',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Keadex-Gh-Url, Keadex-Gh-Authorization',
          },
        ],
      },
    ]
  },
  webpack: function (config, options) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }

    const patterns = [
      {
        from: '../../node_modules/@keadex/mina-react-npm/*.wasm',
        to() {
          return 'static/chunks/[name][ext]'
        },
      },
    ]

    if (options.isServer) {
      // Following is required only for server-side rendering
      // of Mina diagrams (apps\keadex-battisti\src\app\api\mina-diagram\route.ts).
      const fromGlob = require
        .resolve('@keadex/mina-react-npm')
        .replace(/index\.js$/, '')
        .replace(/\\/g, '/')
        .concat('*.wasm')
      patterns.push({
        from: fromGlob,
        to() {
          return 'server/vendor-chunks/[name][ext]'
        },
      })
    }
    config.plugins.push(new CopyPlugin({ patterns }))

    return config
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextra,
  withBundleAnalyzer,
  withMinaLive({ minaLivePackageAlias: '@keadex/mina-live-npm' }),
]

module.exports = composePlugins(...plugins)(nextConfig)
