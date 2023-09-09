/* eslint-env node */
module.exports = {
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.eslint.json',
      './packages/*/tsconfig.json',
      './packages/engine/tests/tsconfig.json',
    ],
  },
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
