import * as keadexUiKitTailwindConfig from '@keadex/keadex-ui-kit/tailwind.config'
import type { Config } from 'tailwindcss'

const config: Config = {
  // "apps/keadex-mina" and "libs/mina-react" are required to import the Mina React component
  // in the documentation
  content: [
    './src/**/*.{js,ts,jsx,tsx,md,mdx,json}',
    './theme.config.jsx',
    '../../apps/keadex-mina/src/**/!(*.stories|*.spec).{ts,tsx,html}',
    '../../libs/keadex-ui-kit/src/**/!(*.stories|*.spec).{ts,tsx,html}',
    '../../libs/mina-react/src/**/!(*.stories|*.spec).{ts,tsx,html}',
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
