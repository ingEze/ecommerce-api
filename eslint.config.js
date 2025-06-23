import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021
      },
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    files: ['src/**/*.ts', 'src/**/*.js', '*.ts', '*.js'],
    rules: {
      // Reglas de formato y estilo
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'prefer-const': 'error',

      // Reglas de indentación y espaciado (2 espacios)
      indent: ['error', 2],
      'space-around-keywords': 'off',
      'space-before-function-paren': ['error', 'never'],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': ['error', 'always'],

      // Reglas para eliminar punto y comas dobles
      'no-extra-semi': 'error',
      'semi-spacing': ['error', { before: false, after: true }],

      // Reglas específicas de TypeScript
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    files: ['src/**/*.js', '*.js'],
    ...tseslint.configs.disableTypeChecked
  }
)
