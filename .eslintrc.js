module.exports = {
  extends: ['react-app', 'prettier'],
  parser: 'babel-eslint',
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'jsx-a11y/href-no-hash': 0,
  },
}
