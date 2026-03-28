module.exports = {
  extends: ['../../.eslintrc.base.cjs', 'plugin:react/recommended'],
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx'] }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'filename-rules/match': ['error', { '.tsx': 'PascalCase', '.ts': 'camelCase' }],
  },
  overrides: [
    {
      files: '*.tsx',
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            leadingUnderscore: 'allow',
          },
        ],
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
}