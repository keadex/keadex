import nx from '@nx/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import globals from 'globals'

import baseConfig from '../../eslint.config.mjs'

export default defineConfig([
  globalIgnores([
    '!**/*',
    'apps/keadex-battisti/.next/**/*',
    'apps/keadex-battisti/next-env.d.ts',
    '**/node_modules',
  ]),
  ...nextVitals,
  ...baseConfig,
  ...nx.configs['flat/react-typescript'],
  {
    files: ['**/*.*'],

    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],

    rules: {
      '@nx/enforce-module-boundaries': [
        'warn',
        {
          checkDynamicDependenciesExceptions: [
            '@keadex/keadex-ui-kit',
            '@keadex/mina-live',
          ],
        },
      ],

      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
])
