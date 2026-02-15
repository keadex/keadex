import { defineConfig, globalIgnores } from 'eslint/config'
import baseConfig from '../../eslint.config.mjs'
import nx from '@nx/eslint-plugin'

export default defineConfig([
  globalIgnores(['!**/*', '**/node_modules']),
  ...baseConfig,
  ...nx.configs['flat/react'],
])
