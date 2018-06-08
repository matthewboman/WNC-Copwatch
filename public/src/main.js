import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRamda from 'vue-ramda'

import App from './App.vue'

Vue.use(VueResource)
Vue.use(VueRamda)
new Vue({
  el: '#app',
  render: h => h(App)
})
