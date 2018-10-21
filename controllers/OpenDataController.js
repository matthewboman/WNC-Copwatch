const arcgis = require('../utils/arcgis')
const traffic_stop = require('../models/traffic_stop')
const fns = require('../utils/functions')

let cache = {
  // pulled directly from Traffic Stop API
  arcgis: {
    date_cached: new Date(Date.now()),
    data: []
  },
  // reformatted with lat/lng and stored in DB
  traffic: {
    date_cached: new Date(Date.now()),
    data: []
  }
}

// allTrafficStops :: Promise [TrafficStop]
const allTrafficStops = () => new Promise((resolve, reject) => {
  traffic_stop.find({}, (err, stops) => {
    if (err) {
      reject(err)
    }
    resolve(stops)
  })
})

// @deprecated
// allArcgisData :: [Report]
const allArcgisData = () => arcgis.getApdData()

module.exports = {

  /*
   * APD Traffic Stops after Oct. 2017
   */
  traffic_stops: () => fns.callandCache(allTrafficStops, 'traffic', cache),

  /*
   *
   */
  arrests: () => {
    // TODO:
  },

  /*
   *
   */
  searches: () => {
    // TODO:
  },

  /*
   * @deprecated
   * API calls to Open Data Reports
   */
  odr: () => fns.callandCache(allArcgisData, 'arcgis', cache),

  /*
   * @deprecated
   */
  odr_arrests: (param) => fns.callandCache(allArcgisData ,'arcgis', cache)
    .then(reports => reports.filter(report => (
        report.driver_arrested == 1 ||
        report.passenger_arrested == 1
      ))),
  /*
   * @deprecated
   */
  odr_searches: (param) => fns.callandCache(allArcgisData, 'arcgis', cache)
    .then(reports => reports.filter(report => (
        report.driver_searched == 1 ||
        report.passenger_searched == 1||
        report.personal_effects_searched == 1 ||
        report.search_initiated == 1 ||
        report.vehicle_searched == 1
      ))),
}
