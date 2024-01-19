import * as keadexUiKitTailwindConfig from '@keadex/keadex-ui-kit/tailwind.config'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,md,mdx}',
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
export default config
