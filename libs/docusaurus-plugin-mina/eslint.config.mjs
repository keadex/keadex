import { defineConfig, globalIgnores } from 'eslint/config'
import baseConfig from '../../eslint.config.mjs'

export default defineConfig([
  globalIgnores(['!**/*', '**/node_modules', '**/dist']),
  ...baseConfig,
])
