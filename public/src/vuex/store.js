import Vue from 'vue'
import Vuex from 'vuex'
const R = require('ramda')

import api from './api'
import bulletins from './modules/bulletins'
import traffic_reports from './modules/traffic_reports'
import {
  previousWeek,
  YYYYMMDD
} from '../utils/functions'

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

  actions: {
    /*
     * bulletin actions
     */
    getBulletinReports: ({ commit }) => {
      commit('TOGGLE_LOADING')
      return api.get('bulletin_reports')
        .then(reports => {
          commit('SET_BULLETIN_REPORTS', reports)
          commit('ALL_BULLETINS_LOADED')
          commit('SET_BULLETIN_DATES')
          commit('FILTER_BULLETIN_REPORTS')
          commit('TOGGLE_LOADING')
        })
        .catch(err => console.log(err))
    },

    getInitialBulletinReports: ({ commit }) => {
      // const today = new Date('August 15, 2018') // testing or whatever
      const today = new Date(Date.now()) // if database is kept up-to-date
      const todayFormatted = YYYYMMDD(today)
      const lastWeek = YYYYMMDD(new Date(previousWeek(today)))
      commit('TOGGLE_LOADING')

      return api.get(`bulletin_reports/range/${lastWeek}/${todayFormatted}`)
        .then(reports => {
          // if there are no reports, `SET_BULLETIN_DATES` throws an error`
          // this happens when DB is not up to date
          if (reports.length) {
            commit('SET_BULLETIN_REPORTS', reports)
            commit('SET_BULLETIN_DATES')
            commit('FILTER_BULLETIN_REPORTS')
          } else {
            // do nothing
          }
          commit('TOGGLE_LOADING')
        })
        .catch(err => console.log(err))
    },

    /*
     * Traffic Stops actions
     */
    getTSReports: ({ commit }) => {
      commit('TOGGLE_LOADING')
      return api.get('open_data/traffic_stops')
        .then(reports => {
          console.log('reports', reports)
          commit('SET_TS_REPORTS', reports)
          commit('SET_TS_DATES')
          commit('FILTER_TS_REPORTS')
          commit('FORMAT_TS_REPORTS')
          // commit('CALCULATE_STATS') // doesn't work
          commit('TOGGLE_LOADING')

        })
        .catch(err => console.log(err))
    },
  },

})
