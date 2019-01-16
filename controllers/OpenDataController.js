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
    const occured = fns.dateFromArcgis(r.dateTime)
    const param = fns.dateFromParam(query.after.toString())
    return occured >= param
  }
  return true
})

// filterBefore :: {} -> [] -> []
const filterBefore = (query, arr) => arr.filter(r => {
  if (query.before) {
    const occured = fns.dateFromArcgis(r.dateTime)
    const param = fns.dateFromParam(query.before.toString())
    return occured <= param
  }
  return true
})

// filterOne :: String -> {} -> [] -> []
const filterOne = (type, query, arr) => arr.filter(r => {
  if (query[type]) {
    if (r[type]) {
      return r[type].toLowerCase().includes(query[type].toLowerCase())
    }
    return false // handle `null`
  }
  return true // apply filter only if part of query
})

// filterArrests :: {} -> [] -> []
const filterArrests = (query, arr) => arr.filter(report => {
  if (query.arrests) {
    return (
      report.driver_arrested == 1 ||
      report.passenger_arrested == 1
    )
  }
  return true
})

// filterSearches :: {} -> [] -> []
const filterSearches = (query, arr) => arr.filter(report => {
  if (query.searches) {
    return (
      report.driver_searched == 1 ||
      report.passenger_searched == 1||
      report.personal_effects_searched == 1 ||
      report.search_initiated == 1 ||
      report.t_search_consent == 1 ||
      report.t_search_warrant == 1 ||
      report.vehicle_searched == 1
    )
  }
  return true
})

// filterUseOfForce :: {} -> [] -> []
const filterUseOfForce = (query, arr) => arr.filter(report => {
  if (query.use_of_force) {
    return report.off_use_force == 1
  }
  return true
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
      const allegation = r => filterOne('allegation', query, r)
      const before = r => filterBefore(query, r)
      const disposition = r => filterOne('disposition', query, r)
      const status = r => filterOne('status', query, r)

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
      const address = r => filterOne('address', query, r)
      const after = r => filterAfter(query, r)
      const before = r => filterBefore(query, r)
      const geo_beat = r => filterOne('geo_beat', query, r)
      const offense_short_description = r => filterOne('offense_short_description', query, r)
      const offense_long_description = r => filterOne('offense_long_description', query, r)

      return fns.applyFilters(
        [
          address,
          after,
          before,
          geo_beat,
          offense_short_description,
          offense_long_description
        ],
        reports
      )
    }),

  /**
   * APD Traffic Stops after Oct. 2017
   */
  traffic_stops: query => OpenDataService.getTSData()
    .then(reports => {
      const after = r => filterAfter(query, r)
      const arrests = r => filterArrests(query, r)
      const before = r => filterBefore(query, r)
      const searches = r => filterSearches(query, r)
      const use_of_force = r =>filterUseOfForce(query, r)

      const tmp = fns.applyFilters(
        [
          after,
          arrests,
          before,
          searches,
          use_of_force
        ],
        reports
      )
      return tmp
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
      const disposition = r => filterOne('disposition', query, r)
      const geo_beat = r => filterOne('geo_beat', query, r)
      const officer_condition_injury = r => filterOne('officer_condition_injury', query, r)
      const status = r => filterOne('status', query, r)
      const subject_injury = r => filterOne('subject_injury', query, r)
      const subject_race = r => filterOne('subject_race', query, r)
      const subject_resistence = r => filterOne('subject_resistence', query, r)
      const subject_sex = r => filterOne('subject_sex', query, r)
      const type_force_used = r => filterOne('type_force_used', query, r)

      return fns.applyFilters(
        [
          after,
          before,
          disposition,
          geo_beat,
          officer_condition_injury,
          status,
          subject_race,
          subject_resistence,
          subject_sex,
          type_force_used
        ],
        reports
      )
    }),

    /**
     * Our Database - APD Traffic Stops after Oct. 2017
     */
    db_traffic_stops: () => dbTrafficStops()
      .then(reports => reports),
}
