module.exports = {
  extends: ['../../.eslintrc.base.cjs'],
  rules: {
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            from: ['./src/interactor', './src/adapter', './src/interface'],
            target: './src/domain',
          },
          {
            from: ['./src/adapter', './src/interface'],
            target: './src/interactor',
          },
          {
            from: ['./src/interface'],
            target: './src/adapter',
            except: ['./socket/action/actionTypes.ts', './socket/eventTypes.ts'],
          },
        ],
      },
    ],
  },
}