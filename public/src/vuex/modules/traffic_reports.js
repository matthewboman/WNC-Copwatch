const R = require('ramda')
import api from '../api'
import {
  calculateStats,
  categoryPerDay,
  conditionalArray,
  filterByDates,
  filterByTrafficDetails,
  formatTrafficStops,
  pastWeek,
  removeDuplicates,
  sortByProp,
  toggleArray,
} from '../../utils/functions'

const state = {
  allTrafficReports: [],
  arrestsPerDay: [],
  displayTrafficReports: false,
  displayedTrafficReports: [], // currently displayed on map
  formattedTrafficReports: [], // for d3 components
  trafficDates: [],
  trafficStartDate: null,
  trafficEndDate: null,
  trafficStopStats: null,
  searchesPerDay: [],
  selectedTrafficDetails: [], // initially empty b/c few will contain all conditions
}
const mutations = {
  'SET_TS_REPORTS': (state, reports) => {
    const sortByDateTime = sortByProp('dateTime')
    state.allTrafficReports = sortByDateTime(reports)
    state.trafficDates = removeDuplicates(reports.map(r => r.dateTime))
  },
  'SET_TS_DATES': (state) => {
    [state.trafficEndDate, state.trafficStartDate] = pastWeek(state.trafficDates)
  },
  'FORMAT_TS_REPORTS': (state) => {
    state.formattedTrafficReports = formatTrafficStops(state.allTrafficReports)
  },
  'CALCULATE_STATS': () => {
    state.trafficStopStats = calculateStats(state.formattedTrafficReports)
  },
  'FILTER_TS_REPORTS': (state) => {
    const dateReports = reports => filterByDates(state.trafficStartDate, state.trafficEndDate, reports)
    const trafficDetailReports = reports => filterByTrafficDetails(state.selectedTrafficDetails, reports)
    const conditionallyRendered = reports => conditionalArray(state.displayTrafficReports, reports)

    state.displayedTrafficReports = R.compose(
      dateReports,
      trafficDetailReports,
      conditionallyRendered
    )(state.allTrafficReports)
  },
  'SET_ARRESTS_PER_DAY': (state, reports) => {
    state.arrestsPerDay = categoryPerDay('arrests', reports)
  },
  'SET_SEARCHES_PER_DAY': (state, reports) => {
    state.searchesPerDay = categoryPerDay('searches', reports)
  },
  'TOGGLE_TS_DISPLAY': (state) => {
    state.displayTrafficReports = !state.displayTrafficReports
  },
  'UPDATE_TS_START': (state, start) => {
    state.trafficStartDate = start
  },
  'UPDATE_TS_END': (state, end) => {
    state.trafficEndDate = end
  },
  'UPDATE_TS_DATES': (state, dates) => {
    state.trafficStartDate = dates.start
    state.trafficEndDate = dates.end
  },
  'UPDATE_DETAILS': (state, detail) => {
    state.selectedTrafficDetails = toggleArray(state.selectedTrafficDetails, detail)
  }
}

const actions = {
  toggleTrafficDisplay: ({ commit }) => {
    commit('TOGGLE_TS_DISPLAY')
    commit('FILTER_TS_REPORTS')
  },
  updateTrafficStart: ({ commit }, start) => {
    commit('UPDATE_TS_START', start)
    commit('FILTER_TS_REPORTS')
  },
  updateTrafficEnd: ({ commit }, end) => {
    commit('UPDATE_TS_END', end)
    commit('FILTER_TS_REPORTS')
  },
  updateTrafficDates: ({ commit }, dates) => {
    commit('UPDATE_TS_DATES', dates)
    commit('FILTER_TS_REPORTS')
  },
  getArrests: ({ commit }) => {
    return api.get('open_data_reports/arrests')
      .then(reports => {
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
  displayTrafficReports: state => state.displayTrafficReports,
  displayedTrafficReports: state => state.displayedTrafficReports,
}

export default {
  state, mutations, actions, getters
}
