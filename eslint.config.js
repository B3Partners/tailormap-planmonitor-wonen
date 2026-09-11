// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const stylistic = require('@stylistic/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const { getInvalidImportsRule } = require('./.eslint-custom-rules');

module.exports = tseslint.config(
  {
    ignores: [
      'dist/**',
      'projects/app/**/environment*.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    plugins: {
      import: importPlugin,
      '@stylistic': stylistic,
    },
    languageOptions: {
      globals: {
        $localize: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@stylistic/no-explicit-any': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'tm',
          style: 'camelCase',
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'off',
          },
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'arrow-parens': [
        'off',
        'always',
      ],
      'comma-dangle': 'off',
      '@stylistic/comma-dangle': [
        'error',
        'always-multiline',
      ],
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-underscore-dangle': 'off',
      'import/no-default-export': 'error',
      'import/order': 'off',
      'arrow-body-style': 'off',
      'semi': 'off',
      '@stylistic/semi': 'error',
      '@stylistic/member-ordering': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: [
            'camelCase',
            'UPPER_CASE',
          ],
        },
        {
          selector: [
            'objectLiteralProperty',
            'classProperty',
          ],
          format: [
            'camelCase',
            'UPPER_CASE',
            'snake_case',
          ],
          leadingUnderscore: 'allowSingleOrDouble',
        },
      ],
      'space-before-function-paren': 'off',
      '@stylistic/space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'ignore',
          asyncArrow: 'always',
        },
      ],
      '@angular-eslint/prefer-standalone': 'off',
      'object-curly-spacing': [
        'error',
        'always',
      ],
      'no-array-constructor': [
        'error',
      ],
      'array-bracket-spacing': [
        'error',
        'always',
        {
          arraysInArrays: false,
          objectsInArrays: false,
          singleValue: false,
        },
      ],
      'comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],
      'max-len': [
        'error',
        180,
      ],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true,
          },
          singleline: {
            delimiter: 'semi',
            requireLast: false,
          },
        },
      ],
    },
  },
  {
    files: ['projects/app/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: [
          'projects/app/tsconfig.app.json',
          'projects/app/tsconfig.spec.json',
        ],
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    files: ['projects/planmonitor-wonen/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: [
          'projects/planmonitor-wonen/tsconfig.lib.json',
          'projects/planmonitor-wonen/tsconfig.spec.json',
        ],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'no-restricted-imports': ['error', getInvalidImportsRule('@b3p/planmonitor-wonen')],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: [
            'camelCase',
            'UPPER_CASE',
          ],
        },
        {
          selector: [
            'objectLiteralProperty',
            'classProperty',
          ],
          format: null,
          leadingUnderscore: 'allowSingleOrDouble',
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.mock.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-empty-function': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
    ],
    rules: {},
  },
);
