/** @type {import('tailwindcss').Config} */
const { join } = require('path')
const keadexUiKitTailwindConfig = require('@keadex/keadex-ui-kit/tailwind.config')

module.exports = {
  content: [
    join(
      __dirname,
      '{src,views,components}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    '../../libs/keadex-ui-kit/src/**/!(*.stories|*.spec).{ts,tsx,html}',
    '../../node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        ...keadexUiKitTailwindConfig.theme.extend.colors,
      },
    },
  },
  plugins: [...keadexUiKitTailwindConfig.plugins],
}
