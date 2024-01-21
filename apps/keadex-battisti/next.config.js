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

const cspHeader = `
    default-src 'self';
    connect-src 'self' https://vercel.live https://consentcdn.cookiebot.com https://region1.google-analytics.com;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://consent.cookiebot.com https://consentcdn.cookiebot.com https://vercel.live https://www.googletagmanager.com;
    frame-src 'self' https://consentcdn.cookiebot.com https://vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://imgsct.cookiebot.com https://www.googletagmanager.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`

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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextra,
  withBundleAnalyzer,
]

module.exports = composePlugins(...plugins)(nextConfig)
