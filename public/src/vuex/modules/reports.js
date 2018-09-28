// state and mutations needs to be handled by store
const state = { }
const mutations = { }

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
}

const getters = {
  displayOpenDataReports: state => state.displayOpenDataReports,
  displayedOpenDataReports: state => state.displayedOpenDataReports,
}

export default {
  state, mutations, actions, getters
}
