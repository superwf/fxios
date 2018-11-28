module.exports = {
  extends: 'react-app',
  parser: 'typescript-eslint-parser',
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'jsx-a11y/href-no-hash': 0,
  },
}
