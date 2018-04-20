import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

export default [
  {
    external: ['isomorphic-fetch'],
    input: 'index.js',
    output: {
      name: 'fetch-maker',
      file: pkg.main,
      format: 'umd',
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
    ],
  },
]
