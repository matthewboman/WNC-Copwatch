const OpenDataService = require('../services/OpenDataService')
const traffic_stop = require('../models/traffic_stop')
const fns = require('../utils/functions')

let cache = {
  traffic: {
    date_cached: new Date(Date.now()),
    data: []
  },
  arrests: {
    date_cached: new Date(Date.now()),
    data: []
  },
  searches: {
    date_cached: new Date(Date.now()),
    data: []
  },
  use_of_force: {
    date_cached: new Date(Date.now()),
    data: []
  },
  daily: {
    date_cached: new Date(Date.now()),
    data: []
  }
}

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

// allTrafficStops :: [Report]
const allTrafficStops = () => OpenDataService.getTSData()

module.exports = {

  /*
   * APD Traffic Stops after Oct. 2017
   */
  db_traffic_stops: () => fns.callandCache(dbTrafficStops, 'traffic', cache),

  traffic_stops: () => fns.callandCache(allTrafficStops, 'traffic', cache),

  ts_daily: () => fns.callandCache(allTrafficStops, 'traffic', cache)
    .then(reports => fns.formatTrafficStops(reports)),

  /*
   * TODO: query the city's service based on params
   */
  ts_arrests: (param) => fns.callandCache(allTrafficStops ,'arrests', cache)
    .then(reports => reports.filter(report => (
        report.driver_arrested == 1 ||
        report.passenger_arrested == 1
      ))),

  /*
   * TODO: query the city's service based on params
   */
  ts_searches: (param) => fns.callandCache(allTrafficStops, 'searches', cache)
    .then(reports => reports.filter(report => (
        report.driver_searched == 1 ||
        report.passenger_searched == 1||
        report.personal_effects_searched == 1 ||
        report.search_initiated == 1 ||
        report.t_search_consent == 1 ||
        report.t_search_warrant == 1 ||
        report.vehicle_searched == 1
      ))),

  ts_stats: () => fns.callandCache(allTrafficStops, 'traffic', cache)
    .then(reports => {
      const formatted = fns.formatTrafficStops(reports)
      return fns.calculateStats(formatted)
    }),

  ts_use_of_force: () => fns.callandCache(allTrafficStops, 'use_of_force', cache)
    .then(reports => reports.filter(report => (
      report.off_use_force == 1
    ))),
}
