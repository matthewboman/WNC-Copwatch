const OpenDataService = require('../services/OpenDataService')
const traffic_stop = require('../models/traffic_stop')
const fns = require('../utils/functions')

/**
 * Sometimes the city's endpoint stops working.
 * This allows us to access what we've stored in our DB
 */

// dbTrafficStops :: Promise [TrafficStop]
const dbTrafficStops = () => new Promise((resolve, reject) => {
  traffic_stop.find({}, (err, stops) => {
    if (err) {
      reject(err)
    }
    resolve(stops)
  })
})

/**
 * Filters for building querystring endpoints
 */

// filterAfter :: {} -> [] -> []
const filterAfter = (query, arr) => arr.filter(r => {
  if (query.after) {
    const occured = fns.dateFromArcgis(r.attributes.occurred_date)
    const param = fns.dateFromParam(query.after.toString())
    return occured >= param
  }
  return true
})

// filterBefore :: {} -> [] -> []
const filterBefore = (query, arr) => arr.filter(r => {
  if (query.before) {
    const occured = fns.dateFromArcgis(r.attributes.occurred_date)
    const param = fns.dateFromParam(query.before.toString())
    return occured <= param
  }
  return true
})

// filterSearch :: String -> {} -> [] -> []
const filterSearch = (type, query, arr) => arr.filter(r => {
  if (query[type]) {
    if (r.attributes[type]) {
      return r.attributes[type].toLowerCase().includes(query[type].toLowerCase())
    }
    return false // handle `null`
  }
  return true // apply filter only if part of query
})

module.exports = {

  /**
   * APD Beats
   */
  beats: () => OpenDataService.getBeats(),

  /**
   * APD Citizen Complaints
   */
  complaints: query => OpenDataService.getComplaintData()
    .then(reports => {
      const after = r => filterAfter(query, r)
      const allegation = r => filterSearch('allegation', query, r)
      const before = r => filterBefore(query, r)
      const disposition = r => filterSearch('disposition', query, r)
      const status = r => filterSearch('status', query, r)

      return fns.applyFilters(
        [
          after,
          allegation,
          before,
          disposition,
          status
        ],
        reports
      )
    }),

  /**
   * APD Incidents
   */
  incidents: query => OpenDataService.getIncidentsData()
    .then(reports => {
      console.log(query)
      const geo_beat = r => filterSearch('geo_beat', query, r)
      return fns.applyFilters(
        [
          geo_beat
        ],
        reports
      )
    }),

  /**
   * APD Traffic Stops after Oct. 2017
   */
  traffic_stops: param => OpenDataService.getTSData()
    .then(reports => {
      console.log(param)
      return reports
    }),

  ts_daily: () => OpenDataService.getTSData()
    .then(reports => fns.formatTrafficStops(reports)),

  ts_arrests: () => OpenDataService.getTSData()
    .then(reports => reports.filter(report => (
        report.driver_arrested == 1 ||
        report.passenger_arrested == 1
      ))),

  ts_searches: () => OpenDataService.getTSData()
    .then(reports => reports.filter(report => (
        report.driver_searched == 1 ||
        report.passenger_searched == 1||
        report.personal_effects_searched == 1 ||
        report.search_initiated == 1 ||
        report.t_search_consent == 1 ||
        report.t_search_warrant == 1 ||
        report.vehicle_searched == 1
      ))),

  ts_stats: () => OpenDataService.getTSData()
    .then(reports => {
      console.log(reports)
      const formatted = fns.formatTrafficStops(reports)
      return fns.calculateStats(formatted)
    }),

  ts_use_of_force: () => OpenDataService.getTSData()
    .then(reports => reports.filter(report => (
      report.off_use_force == 1
    ))),

  /**
   * APD Use of Force
   */
  use_of_force: query => OpenDataService.getUseOfForceData()
    .then(reports => {
      const after = r => filterAfter(query, r)
      const before = r => filterBefore(query, r)
      const county_location = r => filterSearch('county_location', query, r)
      const disposition = r => filterSearch('disposition', query, r)
      const officer_condition_injury = r => filterSearch('officer_condition_injury', query, r)
      const status = r => filterSearch('status', query, r)
      const subject_injury = r => filterSearch('subject_injury', query, r)
      const subject_race = r => filterSearch('subject_race', query, r)
      const subject_resistence = r => filterSearch('subject_resistence', query, r)
      const subject_sex = r => filterSearch('subject_sex', query, r)
      const type_force_used = r => filterSearch('type_force_used', query, r)

      return fns.applyFilters(
        [
          after,
          before,
          county_location,
          disposition,
          officer_condition_injury,
          status,
          subject_race,
          subject_resistence,
          subject_sex,
          type_force_used
        ],
        reports
      )
      return reports
    }),

    /**
     * Our Database - APD Traffic Stops after Oct. 2017
     */
    db_traffic_stops: () => dbTrafficStops()
      .then(reports => reports),
}
