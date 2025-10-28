import { defineConfig, globalIgnores } from 'eslint/config'
import nx from '@nx/eslint-plugin'
import parser from 'jsonc-eslint-parser'

export default defineConfig([
  globalIgnores(['**/node_modules', '**/dist']),
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.?(c|m)js', '**/*.jsx'],

    rules: {
      '@nx/enforce-module-boundaries': [
        'warn',
        {
          enforceBuildableLibDependency: true,
          allow: [],

          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],

      'prefer-template': 'error',
    },
  },
  {
    files: ['**/*.json'],

    languageOptions: {
      parser: parser,
    },

    rules: {
      '@nx/dependency-checks': 'warn',
    },
  },
])
