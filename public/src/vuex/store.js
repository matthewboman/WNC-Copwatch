import Vue from 'vue'
import Vuex from 'vuex'
const R = require('ramda')

import api from './api'
import bulletins from './modules/bulletins'
import reports from './modules/reports'
import {
  conditionalArray,
  filterByCodes,
  filterByDates,
  filterByDescription,
  filterByODRDetails,
  filterByOfficer,
  isTrue,
  odrHashMap,
  pastWeek,
  previousWeek,
  removeDuplicates,
  toggleArray,
  YYYYMMDD
} from './functions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    bulletins,
    reports,
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
      const today = new Date('August 15, 2018') // testing or whatever
      // const today = new Date(Date.now()) // if database is kept up-to-date
      const todayFormatted = YYYYMMDD(today)
      const lastWeek = YYYYMMDD(new Date(previousWeek(today)))
      commit('TOGGLE_LOADING')

      return api.get(`bulletin_reports/range/${lastWeek}/${todayFormatted}`)
        .then(reports => {
          commit('SET_BULLETIN_REPORTS', reports)
          commit('SET_BULLETIN_DATES')
          commit('FILTER_BULLETIN_REPORTS')
          commit('TOGGLE_LOADING')
        })
        .catch(err => console.log(err))
    },

    /*
     * Open Data actions
     */
    getOpenDataReports: ({ commit }) => {
      commit('TOGGLE_LOADING')
      return api.get('open_data_reports')
        .then(reports => {
          commit('SET_OPEN_REPORTS', reports)
          commit('SET_OPEN_DATA_DATES')
          commit('FILTER_OPEN_DATA_REPORTS')
          commit('TOGGLE_LOADING')

        })
        .catch(err => console.log(err))
    },
  },
  getters: {
    allReports: state => state.allReports,
    // displayedReports: state => state.displayedReports,
  },

})
