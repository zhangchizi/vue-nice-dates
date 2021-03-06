import path from 'path'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import common from '@rollup/plugin-commonjs'

export default {
  input: 'website/index.js',
  output: {
    file: 'website/src/main.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    vue(),
    postcss(),
    resolve({
      extensions: ['.js', '.vue']
    }),
    common(),
    babel({ exclude: ['node_modules/**'] }),
    serve({
      open: false,
      contentBase: path.join(__dirname, 'website', 'src'),
      host: '0.0.0.0',
      port: 1234
    }),
    livereload({
      verbose: true,
      watch: ['website', 'examples', 'src']
    })
  ]
}
