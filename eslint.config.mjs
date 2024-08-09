// @ts-check

import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jest from 'eslint-plugin-jest'
import globals from 'globals'
import tslint from 'typescript-eslint'

export default tslint.config(
  {
    name: 'base/ignoreFiles',
    ignores: ['lib/', 'dist/', 'coverage/']
  },
  {
    name: 'base/defaultMatches',
    files: ['**/*.{js,mjs,cjs,ts}']
  },
  {
    name: 'base/globals',
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
      }
    }
  },
  js.configs.recommended,
  tslint.configs.eslintRecommended,
  ...tslint.configs.recommended,
  {
    name: 'base/projectRules',
    plugins: {
      '@typescript-eslint': tslint.plugin
    },
    languageOptions: {
      parser: tslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2023,
        project: ['tsconfig.json', 'tsconfig.*.json']
      }
    },
    rules: {
      camelcase: 'off',
      'eslint-comments/no-use': 'off',
      'eslint-comments/no-unused-disable': 'off',
      'i18n-text/no-en': 'off',
      'import/no-namespace': 'off',
      'no-console': 'off',
      'no-unused-vars': 'off',
      'prettier/prettier': 'error',
      semi: 'off',
      '@typescript-eslint/array-type': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public' }
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true }
      ],
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extraneous-class': 'error',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-function-type': 'warn',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/restrict-plus-operands': 'error',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/unbound-method': 'error'
    }
  },
  {
    name: 'jest/rules',
    files: ['__tests__/**/*.{js,mjs,cjs,ts}'],
    ...jest.configs['flat/recommended']
  },
  prettier
)
