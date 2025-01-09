module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'at-rule-no-unknown': [
      'error',
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    // Add other rules as needed
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}; 