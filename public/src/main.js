import Vue from 'vue'
import VueResource from 'vue-resource'

import Home from './Home.vue'
import store from './vuex/store'

Vue.use(VueResource)

new Vue({
  el: '#app',
  store,
  render: h => h(Home)
})
