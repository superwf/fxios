import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

const umdConfig = {
  input: 'index.ts',
  output: {
    name: 'fxios',
    file: pkg['umd:main'],
    sourcemap: true,
    format: 'umd',
    globals: 'fetch',
  },
  plugins: [
    typescript({
      target: 'es5',
      sourceMap: true,
      declaration: true,
      declarationDir: 'dist',
    }),
    // builtins({ url: true }),
    resolve({
      preferBuiltins: false,
    }),
    commonjs(),
  ],
}

export default [
  {
    external: ['path-to-regexp', 'url'],
    input: 'index.ts',
    output: {
      file: pkg.module,
      format: 'esm',
      globals: 'fetch',
    },
    plugins: [
      typescript({
        target: 'esnext',
      }),
      resolve(),
      commonjs(),
    ],
  },
  umdConfig,
  // umd format for production
  {
    ...umdConfig,
    output: {
      ...umdConfig.output,
      file: pkg.unpkg,
      sourcemap: false,
    },
    plugins: [...umdConfig.plugins, uglify()],
  },
]
