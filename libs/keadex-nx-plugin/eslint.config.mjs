import { defineConfig, globalIgnores } from 'eslint/config'
import baseConfig from '../../eslint.config.mjs'
import parser from 'jsonc-eslint-parser'

export default defineConfig([
  globalIgnores(['!**/*', '**/node_modules']),
  ...baseConfig,
  {
    files: ['./package.json', './generators.json', './executors.json'],
    languageOptions: {
      parser: parser,
    },
    rules: {
      '@nx/nx-plugin-checks': 'error',
    },
  },
])
