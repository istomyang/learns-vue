module.exports = {
  //https://www.npmjs.com/package/@typescript-eslint/parser
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',

    tsconfigRootDir: __dirname,
    // Bug: If saying not include in setting, must open project without link path
    project: 'tsconfig.json',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    quotes: 'off',
    '@typescript-eslint/quotes': ['warn', 'single', { avoidEscape: true }],
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}
