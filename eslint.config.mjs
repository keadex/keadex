import nx from '@nx/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import * as mdx from 'eslint-plugin-mdx'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import parser from 'jsonc-eslint-parser'

export default defineConfig([
  globalIgnores(['**/node_modules', '**/dist']),
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ...mdx.flat,
  },
  {
    ...mdx.flatCodeBlocks,
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
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
