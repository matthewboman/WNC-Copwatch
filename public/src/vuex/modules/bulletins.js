// state and mutations needs to be handled by store
const state = { }
const mutations = { }

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
