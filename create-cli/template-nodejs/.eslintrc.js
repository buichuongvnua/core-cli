module.exports = {
  env: {
    browser: false,
    commonjs: false,
    es6: true,
  },
  // extends: ['airbnb-base'],
  extends: ['prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-plusplus': 'off',
    'no-useless-constructor': 'off',
    'prettier/prettier': ['error'],
  },
}
