import builtins from 'rollup-plugin-node-builtins'
import resolve from 'rollup-plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

const umdConfig = {
  input: 'index.ts',
  output: {
    name: 'Fxios',
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
    builtins({ url: true }),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
  ],
}

export default [
  // not work for `declaration` option
  // {
  //   external: ['path-to-regexp', 'url'],
  //   input: 'index.ts',
  //   output: {
  //     file: pkg.module,
  //     format: 'esm',
  //     globals: 'fetch',
  //   },
  //   plugins: [
  //     typescript({
  //       target: 'esnext',
  //       declaration: true,
  //       declarationDir: 'dist',
  //     }),
  //     resolve(),
  //     commonjs(),
  //   ],
  // },
  umdConfig,
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
