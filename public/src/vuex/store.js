import Vue from 'vue'
import Vuex from 'vuex'
const R = require('ramda')

import bulletins from './modules/bulletins'
import traffic_reports from './modules/traffic_reports'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    bulletins,
    traffic_reports,
  },

  state: {
    loading: false,
  },

  mutations: {
    'TOGGLE_LOADING': (state) => {
      state.loading = !state.loading
    },
  },

  actions: { },

})
