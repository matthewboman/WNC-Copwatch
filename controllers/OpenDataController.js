const arcgis = require('../utils/arcgis')
const fns = require('../utils/functions')

let cache = {
  arcgis: {
    date_cached: new Date(Date.now()),
    data: []
  },
}

// allArcgisData :: [Report]
const allArcgisData = () => arcgis.getApdData()

module.exports = {
  /*
   * API calls to Open Data Reports
   */
  odr: () => fns.callandCache(allArcgisData, 'arcgis', cache),

  /*
   * TODO: let's not filter on our end but query their app
   */
  odr_arrests: (param) => fns.callandCache(allArcgisData ,'arcgis', cache)
    .then(reports => reports.filter(report => (
        report.driver_arrested == 1 ||
        report.passenger_arrested == 1
      ))),

  odr_searches: (param) => fns.callandCache(allArcgisData, 'arcgis', cache)
    .then(reports => reports.filter(report => (
        report.driver_searched == 1 ||
        report.passenger_searched == 1||
        report.personal_effects_searched == 1 ||
        report.search_initiated == 1 ||
        report.vehicle_searched == 1
      ))),
}
