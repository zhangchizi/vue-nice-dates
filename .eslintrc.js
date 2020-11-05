module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  parser: 'vue-eslint-parser',
  extends: [
    'standard',
    'plugin:jest/recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['jest', 'vue', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          normal: 'never'
        }
      }
    ]
  }
}
