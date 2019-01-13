import compose from 'ramda/src/compose'
import api from '../api'
import {
  calculateStats,
  conditionalArray,
  filterByDates,
  filterByTrafficDetails,
  pastWeek,
  removeDuplicates,
  sortByProp,
  toggleArray,
} from '../../utils/functions'

const state = {
  allTrafficReports: [],
  displayTrafficReports: false,
  displayedTrafficReports: [], // currently displayed on map
  formattedTrafficReports: [], // for d3 components
  trafficDates: [],
  trafficStartDate: null,
  trafficEndDate: null,
  trafficStopStats: null,
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
  'SET_TS_DAILY_BREAKDOWN': (state, reports) => {
    state.formattedTrafficReports = reports
  },
  'CALCULATE_STATS': (state, stats) => {
    state.trafficStopStats = stats
  },
  'FILTER_TS_REPORTS': (state) => {
    const dateReports = reports => filterByDates(state.trafficStartDate, state.trafficEndDate, reports)
    const trafficDetailReports = reports => filterByTrafficDetails(state.selectedTrafficDetails, reports)
    const conditionallyRendered = reports => conditionalArray(state.displayTrafficReports, reports)

    state.displayedTrafficReports = compose(
      dateReports,
      trafficDetailReports,
      conditionallyRendered
    )(state.allTrafficReports)
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
  /**
   * Component actions
   */
  toggleTrafficDisplay: ({ commit }) => {
    commit('TOGGLE_TS_DISPLAY')
    commit('FILTER_TS_REPORTS')
  },
  updateDetails: ({ commit}, detail) => {
    commit('UPDATE_DETAILS', detail)
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

  /**
   * API requests
   */
  getTSBreakdown: ({ commit }) => {
    return api.get('open-data/traffic-stops/daily-breakdown')
      .then(reports => {
        commit('SET_TS_DAILY_BREAKDOWN', reports)
      })
      .catch(err => console.log(err))
  },

  getTSReports: ({ commit }) => {
    commit('TOGGLE_LOADING')
    return api.get('open-data/traffic-stops')
      .then(reports => {
        commit('SET_TS_REPORTS', reports)
        commit('SET_TS_DATES')
        commit('FILTER_TS_REPORTS')
        commit('TOGGLE_LOADING')
      })
      .catch(err => console.log(err))
  },

  getTSStatistics: ({ commit }) => {
    return api.get('open-data/traffic-stops/statistics')
      .then(stats => {
        commit('CALCULATE_STATS', stats)
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
