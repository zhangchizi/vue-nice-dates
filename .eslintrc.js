module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  parser: 'vue-eslint-parser',
  extends: ['standard', 'plugin:jest/recommended', 'plugin:vue/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['jest','vue'],
  rules: {
    'vue/html-self-closing': ['error', {
      html: {
        normal: 'never'
      }
    }],
    'vue/no-v-html': 0
  }
}
