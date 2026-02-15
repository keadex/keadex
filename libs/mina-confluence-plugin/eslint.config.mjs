import { defineConfig, globalIgnores } from 'eslint/config'
import baseConfig from '../../eslint.config.mjs'
import nx from '@nx/eslint-plugin'

export default defineConfig([
  globalIgnores(['!**/*', '**/node_modules', '**/static']),
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
