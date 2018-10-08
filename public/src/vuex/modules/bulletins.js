const R = require('ramda')
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
} from '../functions'

const state = {
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
}
const mutations = {
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
}

const actions = {
  toggleBulletinDisplay: ({ commit }) => {
    commit('TOGGLE_BULLETIN_DISPLAY')
    commit('FILTER_BULLETIN_REPORTS')
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
}

const getters = {
  displayBulletinReports: state => state.displayBulletinReports,
  displayedBulletinReports: state => state.displayedBulletinReports,
  selectedOfficer: state => state.selectedOfficer,
}

export default {
  state, mutations, actions, getters
}
