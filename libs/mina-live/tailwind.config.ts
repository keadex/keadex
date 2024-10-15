import * as keadexUiKitTailwindConfig from '@keadex/keadex-ui-kit/tailwind.config'
import { join } from 'path'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    join(
      __dirname,
      '../../apps/keadex-mina/src/**/!(*.stories|*.spec).{ts,tsx,html}',
    ),
    join(
      __dirname,
      '../../libs/keadex-ui-kit/src/**/!(*.stories|*.spec).{ts,tsx,html}',
    ),
    join(__dirname, '../../node_modules/tw-elements/dist/js/**/*.js'),
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
