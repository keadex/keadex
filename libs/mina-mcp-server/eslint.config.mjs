import nx from '@nx/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'

import baseConfig from '../../eslint.config.mjs'

export default defineConfig([
  globalIgnores(['!**/*', '**/node_modules', '**/dist', '**/src-rust']),
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': ['warn'],
    },
  },
])
