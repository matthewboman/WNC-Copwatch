import compose from 'ramda/src/compose'
import api from '../api'
import {
  conditionalArray,
  filterByCodes,
  filterByDates,
  filterByDescription,
  filterByOfficer,
  pastWeek,
  previousWeek,
  removeDuplicates,
  toggleArray,
  YYYYMMDD
} from '../../utils/functions'

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

    state.displayedBulletinReports = compose(
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
  'UPDATE_DESCRIPTION': (state, description) => {
    state.descriptionSearchTerm = description
  },
  'ALL_BULLETINS_LOADED': (state) => {
    state.allBulletinsLoaded = true
  },
}

const actions = {
  /**
   * Component actions
   */
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
  updateDescriptions: ({ commit }, description) => {
    commit('UPDATE_DESCRIPTION', description)
    commit('FILTER_BULLETIN_REPORTS')
  },

  /**
   * API requests
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
    // const today = new Date('August 15, 2018') // testing or whatever
    const today = new Date(Date.now()) // if database is kept up-to-date
    const todayFormatted = YYYYMMDD(today)
    const lastWeek = YYYYMMDD(new Date(previousWeek(today)))
    commit('TOGGLE_LOADING')

    return api.get(`bulletin-reports/range/${lastWeek}/${todayFormatted}`)
      .then(reports => {
        // if there are no reports, `SET_BULLETIN_DATES` throws an error`
        // this happens when DB is not up to date
        if (reports.length) {
          commit('SET_BULLETIN_REPORTS', reports)
          commit('SET_BULLETIN_DATES')
          commit('FILTER_BULLETIN_REPORTS')
        } else {
          // do nothing
        }
        commit('TOGGLE_LOADING')
      })
      .catch(err => console.log(err))
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
