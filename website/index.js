import Vue from 'vue'
import App from './app'
import 'prismjs/themes/prism-coy.css'

Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App)
})
