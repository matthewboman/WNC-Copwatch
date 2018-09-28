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
    /* shared state */
    loading: false,

    /* bulletin state */
    allBulletinsLoaded: false,
    allBulletinReports: [],
    displayBulletinReports: false,
    displayedBulletinReports: [],
    bulletinDates: [],
    bulletinStartDate: null,
    bulletinEndDate: null,
    selectedOfficer: null,
    officers: [],
    descriptionSearchTerm: '',
    selectedCodes: ['AR', 'TC', 'LW'], // intially w/ all values

    /* open data state */
    allOpenDataReports: [],
    displayOpenDataReports: false,
    displayedOpenDataReports: [],
    openDataDates: [],
    openStartDate: null,
    openEndDate: null,
    selectedODRDetails: [], // initially empty b/c few will contain all conditions
  },
  mutations: {
    /*
     * shared mutations
     */
    'TOGGLE_LOADING': (state) => {
      state.loading = !state.loading
    },

    /*
     * Bulletin Mutations
     */
    'SET_BULLETIN_REPORTS': (state, reports) => {
      state.allBulletinReports = reports
      state.bulletinDates = removeDuplicates(reports.map(r => r.dateTime))
      state.officers = removeDuplicates(reports.map(r => r.officer))
    },
    'SET_BULLETIN_DATES': (state) => {
      [state.bulletinEndDate, state.bulletinStartDate] = pastWeek(state.bulletinDates)
    },
    'FILTER_BULLETIN_REPORTS': (state) => {
      const officerReports = reports => filterByOfficer(state.selectedOfficer, reports)
      const codeReports = reports => filterByCodes(state.selectedCodes, reports)
      const dateReports = reports => filterByDates(state.bulletinStartDate, state.bulletinEndDate, reports)
      const descriptionReports = reports => filterByDescription(state.descriptionSearchTerm, reports)
      const conditionallyRendered = reports => conditionalArray(state.displayBulletinReports, reports)

      state.displayedBulletinReports = R.compose(
        officerReports,
        codeReports,
        dateReports,
        descriptionReports,
        conditionallyRendered,
      )(state.allBulletinReports)
    },
    'TOGGLE_BULLETIN_DISPLAY': (state) => {
      state.displayBulletinReports = !state.displayBulletinReports
    },
    'UPDATE_OFFICER': (state, officer) => {
      state.selectedOfficer = officer
    },
    'UPDATE_CODE': (state, code) => {
      state.selectedCodes = toggleArray(state.selectedCodes, code)
    },
    'UPDATE_BULLETIN_DATES': (state, dates) => {
      state.bulletinStartDate = dates.start
      state.bulletinEndDate = dates.end
    },
    'UPDATE_BULLETIN_START': (state, start) => {
      state.bulletinStartDate = start
    },
    'UPDATE_BULLETIN_END': (state, end) => {
      state.bulletinEndDate = end
    },
    'ALL_BULLETINS_LOADED': (state) => {
      state.allBulletinsLoaded = true
    },

    /*
     * Open Data Mutations
     */
    'SET_OPEN_REPORTS': (state, reports) => {
      state.allOpenDataReports = reports
      state.openDataDates = removeDuplicates(reports.map(r => r.dateTime))
    },
    'SET_OPEN_DATA_DATES': (state) => {
      [state.openEndDate, state.openStartDate] = pastWeek(state.openDataDates)
    },
    'FILTER_OPEN_DATA_REPORTS': (state) => {
      const dateReports = reports => filterByDates(state.openStartDate, state.openEndDate, reports)
      const odrDetailReports = reports => filterByODRDetails(state.selectedODRDetails, reports)
      const conditionallyRendered = reports => conditionalArray(state.displayOpenDataReports, reports)

      state.displayedOpenDataReports = R.compose(
        dateReports,
        odrDetailReports,
        conditionallyRendered
      )(state.allOpenDataReports)
    },
    'TOGGLE_OPEN_DATA_DISPLAY': (state) => {
      state.displayOpenDataReports = !state.displayOpenDataReports
    },
    'UPDATE_ODR_START': (state, start) => {
      state.openStartDate = start
    },
    'UPDATE_ODR_END': (state, end) => {
      state.openEndDate = end
    },
    'UPDATE_OPEN_DATES': (state, dates) => {
      state.openStartDate = dates.start
      state.openEndDate = dates.end
    },
    'UPDATE_DESCRIPTION': (state, description) => {
      state.descriptionSearchTerm = description
    },
    'UPDATE_DETAILS': (state, detail) => {
      state.selectedODRDetails = toggleArray(state.selectedODRDetails, detail)
    }
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
      const today = new Date('August 15, 2018')
      // const today = new Date(Date.now())
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
    displayedReports: state => state.displayedReports,
  },

})
