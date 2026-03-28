module.exports = {
  root: true,
  env: {
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'plugin:import/recommended',
    'plugin:import/typescript',
    'standard-with-typescript',
    'prettier'
  ],
  plugins: ['filename-rules'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',

    'filename-rules/match': ['error', { '.ts': 'camelCase' }],

    '@typescript-eslint/naming-convention': [
      'error',
      { selector: ['class', 'interface', 'typeAlias'], format: ['PascalCase'] },
      { selector: ['property'], format: ['camelCase'], leadingUnderscore: 'allow' },
      {
        selector: ['property'],
        modifiers: ['readonly'],
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      { selector: ['objectLiteralProperty'], format: ['UPPER_CASE', 'camelCase'], leadingUnderscore: 'allow' },
      { selector: ['parameterProperty'], format: ['camelCase'], leadingUnderscore: 'allow' },
      { selector: 'variable', format: ['camelCase'], leadingUnderscore: 'allow' },
      {
        selector: ['variable'],
        modifiers: ['const'],
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      { selector: ['method', 'function'], format: ['camelCase'] },
    ],

    '@typescript-eslint/explicit-member-accessibility': 'warn',
  },

  overrides: [
    {
      files: '*.d.ts',
      rules: {
        'filename-rules/match': ['error', 'kebab-case'],
      },
    },
    {
      files: 'I*.ts',
      rules: {
        'filename-rules/match': ['error', 'PascalCase'],
      },
    },
  ],
}