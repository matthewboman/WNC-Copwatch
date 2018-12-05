import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import App from './App.vue'
import { routes } from './routes'
import store from './vuex/store'

require('bootstrap/dist/css/bootstrap.min.css')
// require('../../node_modules/bootstrap/dist/css/bootstrap.min.css')
require('./main.scss')

Vue.use(VueResource)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
