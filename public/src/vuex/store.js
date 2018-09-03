import Vue from 'vue'
import Vuex from 'vuex'
const R = require('ramda')

import api from './api'

Vue.use(Vuex)

// pastWeek :: [Date] -> (Date, Date)
const pastWeek = dates => {
  const last = R.last(dates)
  let previous = new Date(last)
  previous.setDate(previous.getDate() - 7)
  return [last, previous.toISOString()]
}

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

// const ordHashMap :: String -> Boolean
const ordHashMap = {
  warrant: report => (
    report.t_search_warrant == 1
  ),
  consent: report => (
    report.t_search_consent == 1
  ),
  probable: report => (
    report.t_probable_cause == 1
  ),
  resist: report => (
    report.off_phys_resis == 1
  ),
  search: report => (
    report.driver_searched == 1 ||
    report.passenger_searched == 1 ||
    report.personal_effects_searched == 1 ||
    report.search_initiated == 1 ||
    report.vehicle_searched == 1
  ),
  arrest: report => (
    report.driver_arrested == 1 ||
    report.passenger_arrested == 1 ||
    report.t_inc_arrest == 1
  )
}

// isTrue :: a -> Boolean
const isTrue = value => value == true

// filterByODRDetails :: [String] -> [{}] -> [{}]
const filterByODRDetails = (details, reports) => reports.filter(report =>
  R.all(isTrue)(details.map(detail => ordHashMap[detail](report)))
)

// toggleArray :: [a] -> a -> [a]
const toggleArray = (array, value) => array.includes(value)
  ? array.filter(v => v != value)
  : [...array, value]

export default new Vuex.Store({
  state: {
    /* bulletin state */
    allBulletinReports: [],
    displayBulletinReports: false,
    displayedBulletinReports: [],
    bulletinDates: [],
    bulletinStartDate: null,
    bulletinEndDate: null,
    selectedOfficer: null,
    officers: [],
    descriptionSearchTerm: '',

    // BUG: codes and filtering
    selectedCodes: ['AR', 'TC', 'LW'],
    codes: {
      'AR': true,
      'TC': true,
      'LW': true
    },

    /* open data state */
    allOpenDataReports: [],
    displayOpenDataReports: true,
    displayedOpenDataReports: [],
    openDataDates: [],
    openStartDate: null,
    openEndDate: null,
    selectedODRDetails: [],
  },
  mutations: {
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

      state.displayedBulletinReports = R.compose(
        officerReports,
        codeReports,
        dateReports,
        descriptionReports
      )(state.allBulletinReports)
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
      const ordDetailReports = reports => filterByODRDetails(state.selectedODRDetails, reports)

      state.displayedOpenDataReports = R.compose(
        dateReports,
        ordDetailReports
      )(state.allOpenDataReports)
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
      return api.get('bulletin_reports/range/20180801/20180815')
        .then(reports => {
          commit('SET_BULLETIN_REPORTS', reports)
          commit('SET_BULLETIN_DATES')
          commit('FILTER_BULLETIN_REPORTS')
        })
        .catch(err => console.log(err))
    },
    updateOfficer: ({ commit }, officer) => {
      commit('UPDATE_OFFICER', officer)
      commit('FILTER_BULLETIN_REPORTS')
    },
    updateCode: ({ commit }, code) => {
      commit('UPDATE_CODE', code)
      commit('FILTER_BULLETIN_REPORTS')
    },
    updateBulletinDates: ({ commit }, dates) => {
      commit('UPDATE_BULLETIN_DATES', dates)
      commit('FILTER_BULLETIN_REPORTS')
    },
    updateBulletinStart: ({ commit }, start) => {
      commit('UPDATE_BULLETIN_START', start)
      commit('FILTER_BULLETIN_REPORTS')
    },
    updateBulletinEnd: ({ commit }, end) => {
      commit('UPDATE_BULLETIN_END', end)
      commit('FILTER_BULLETIN_REPORTS')
    },
    updateDetails: ({ commit}, detail) => {
      commit('UPDATE_DETAILS', detail)
      commit('FILTER_OPEN_DATA_REPORTS')
    },

    /*
     * Open Data actions
     */
    getOpenDataReports: ({ commit }) => {
      return api.get('open_data_reports')
        .then(reports => {
          commit('SET_OPEN_REPORTS', reports)
          commit('SET_OPEN_DATA_DATES')
          commit('FILTER_OPEN_DATA_REPORTS')
        })
        .catch(err => console.log(err))
    },
    updateODRStart: ({ commit }, start) => {
      commit('UPDATE_ODR_START', start)
      commit('FILTER_OPEN_DATA_REPORTS')
    },
    updateODREnd: ({ commit }, end) => {
      commit('UPDATE_ODR_END', end)
      commit('FILTER_OPEN_DATA_REPORTS')
    },
    updateOpenDates: ({ commit }, dates) => {
      commit('UPDATE_OPEN_DATES', dates)
      commit('FILTER_OPEN_DATA_REPORTS')
    },
    updateDescriptions: ({ commit }, description) => {
      commit('UPDATE_DESCRIPTION', description)
      commit('FILTER_BULLETIN_REPORTS')
    },
  },
  getters: {
    allReports: state => state.allReports,
    displayedReports: state => state.displayedReports,

    /*
     * bulletin getters
     */
    displayBulletinReports: state => state.displayBulletinReports,
    displayedBulletinReports: state => state.displayedBulletinReports,
    selectedOfficer: state => state.selectedOfficer,


    /*
     * open data getters
     */
    displayOpenDataReports: state => state.displayOpenDataReports,
    displayedOpenDataReports: state => state.displayedOpenDataReports,
  },

})
