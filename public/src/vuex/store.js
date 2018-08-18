import Vue from 'vue'
import Vuex from 'vuex'
const R = require('ramda')

import api from './api'

Vue.use(Vuex)

// removeDuplicates :: [a] -> [a]
const removeDuplicates = array => array.filter((item, pos, arr) => arr.indexOf(item) == pos).sort()

// filterByOfficer :: String -> [{}] -> [{}]
const filterByOfficer = (officer, reports) => !officer
  ? reports
  : reports.filter(r => r.officer == officer)

// filterByCodes :: [String] -> [{}] -> [{}]
const filterByCodes = (codes, reports) => reports.filter(r => codes.includes(r.code))

// filterByDates :: Date -> Date -> [{}] -> [{}]
const filterByDates = (start, end, reports) => (!start || !end)
  ? reports
  : reports.filter(r => ((r.dateTime >= start) && (r.dateTime <= end)))

// filterByDescription :: String -> [{}] -> [{}]
const filterByDescription = (description, reports) => description.length
  ? reports.filter(r => r.description.toLowerCase().includes(description.toLowerCase()))
  : reports

export default new Vuex.Store({
  state: {
    leafleftMap: null,
    tileLayer: null,
    markers: [],
    allReports: [],
    displayedReports: [],
    selectedCodes: ['AR', 'TC', 'LW'],
    codes: {
      'AR': true,
      'TC': true,
      'LW': true
    },
    selectedOfficer: null,
    officers: [],
    dates: [],
    startDate: null,
    endDate: null,
    descriptionSearchTerm: ''
  },
  mutations: {
    'SET_REPORTS': (state, reports) => {
      state.allReports = reports
      state.displayedReports = reports
      state.officers = removeDuplicates(reports.map(r => r.officer))
      state.dates = removeDuplicates(reports.map(r => r.dateTime))
    },
    'FILTER_REPORTS': (state) => {
      const officerReports = reports => filterByOfficer(state.selectedOfficer, reports)
      const codeReports = reports => filterByCodes(state.selectedCodes, reports)
      const dateReports = reports => filterByDates(state.startDate, state.endDate, reports)
      const descriptionReports = reports => filterByDescription(state.descriptionSearchTerm, reports)

      state.displayedReports = R.compose(
        officerReports,
        codeReports,
        dateReports,
        descriptionReports
      )(state.allReports)
    },
    'UPDATE_OFFICER': (state, officer) => {
      state.selectedOfficer = officer
    },
    'UPDATE_CODE': (state, code) => {
      state.selectedCodes = state.selectedCodes.includes(code)
        ? state.selectedCodes.filter(r => r != code)
        : [...state.selectedCodes, code]
    },
    'UPDATE_DATES': (state, dates) => {
      state.startDate = dates.start
      state.endDate = dates.end
    },
    'UPDATE_DESCRIPTION': (state, description) => {
      state.descriptionSearchTerm = description
    },
  },
  actions: {
    getReports: ({ commit }) => {
      // return api.get('reports')
      return api.get('bulletin_reports/range/20180401/20180415')
        .then(res => {
          commit('SET_REPORTS', res)
        })
        .catch(err => console.log(err))
    },
    updateOfficer: ({ commit }, officer) => {
      commit('UPDATE_OFFICER', officer)
      commit('FILTER_REPORTS')
    },
    updateCode: ({ commit }, code) => {
      commit('UPDATE_CODE', code)
      commit('FILTER_REPORTS')
    },
    updateDates: ({ commit }, dates) => {
      commit('UPDATE_DATES', dates)
      commit('FILTER_REPORTS')
    },
    updateDescriptions: ({ commit }, description) => {
      commit('UPDATE_DESCRIPTION', description)
      commit('FILTER_REPORTS')
    }
  },
  getters: {
    allReports: state => state.allReports,
    displayedReports: state => state.displayedReports,
    selectedOfficer: state => state.selectedOfficer,
    selectedDates: state => ({ start: state.startDate, end: state.endDate }),
  }
})
