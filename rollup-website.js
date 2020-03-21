import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import common from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'website/index.js',
  output: {
    file: 'website/src/main.js',
    format: 'iife',
    sourcemap: false
  },
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    vue(),
    postcss(),
    resolve({
      extensions: ['.js', '.vue']
    }),
    common(),
    babel({ exclude: ['node_modules/**'] }),
    terser()
  ]
}
