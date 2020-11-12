module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  parser: 'vue-eslint-parser',
  extends: [
    'plugin:jest/recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier/vue'
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
