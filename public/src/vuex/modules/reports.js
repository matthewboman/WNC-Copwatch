const R = require('ramda')
import api from '../api'
import {
  categoryPerDay,
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
  sortByProp,
  toggleArray,
  YYYYMMDD
} from '../functions'

const state = {
  allOpenDataReports: [],
  arrestsPerDay: [],
  displayOpenDataReports: false,
  displayedOpenDataReports: [],
  openDataDates: [],
  openStartDate: null,
  openEndDate: null,
  searchesPerDay: [],
  selectedODRDetails: [], // initially empty b/c few will contain all conditions
}
const mutations = {
  'SET_OPEN_REPORTS': (state, reports) => {
    const sortByDateTime = sortByProp('dateTime')
    state.allOpenDataReports = sortByDateTime(reports)
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
  'SET_ARRESTS_PER_DAY': (state, reports) => {
    state.arrestsPerDay = categoryPerDay('arrests', reports)
    // console.log(state.arrestsPerDay)
  },
  'SET_SEARCHES_PER_DAY': (state, reports) => {
    state.searchesPerDay = categoryPerDay('searches', reports)
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
}

const actions = {
  toggleODRDisplay: ({ commit }) => {
    commit('TOGGLE_OPEN_DATA_DISPLAY')
    commit('FILTER_OPEN_DATA_REPORTS')
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
  getArrests: ({ commit }) => {
    return api.get('open_data_reports/arrests')
      .then(reports => {
        // console.log('arrests returned', reports)
        commit('SET_ARRESTS_PER_DAY', reports)
      })
      .catch(err => console.log(err))
  },
  getSearches: ({ commit }) => {
    return api.get('open_data_reports/searches')
      .then(reports => {
        commit('SET_SEARCHES_PER_DAY', reports)
      })
      .catch(err => console.log(err))
  }

}

const getters = {
  displayOpenDataReports: state => state.displayOpenDataReports,
  displayedOpenDataReports: state => state.displayedOpenDataReports,
}

export default {
  state, mutations, actions, getters
}
