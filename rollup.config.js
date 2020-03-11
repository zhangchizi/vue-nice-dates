import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import { eslint } from 'rollup-plugin-eslint'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'vueNiceDates',
      globals: {
        'date-fns': 'DateFns'
      }
    }
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.vue']
    }),
    eslint({
      exclude: '**/*.scss'
    }),
    vue(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false
    }),
    terser()
  ],
  external: ['date-fns']
}
