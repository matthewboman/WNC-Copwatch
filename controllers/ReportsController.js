const Report = require('../models/report')
const arcgis = require('../utils/arcgis')

let cache = {
  arcgis: {
    date_cached: new Date(Date.now()),
    data: []
  },
  mongo: {
    date_cached: new Date(Date.now()),
    data: []
  }
}

// same_day :: Cache.name -> Cache -> Bool
const same_day = (cache_name, cache) =>
  new Date(Date.now()).getDay() == cache[cache_name].date_cached.getDay()

// dateFromParam :: String -> Date
const dateFromParam = yyyymmdd => new Date(
  yyyymmdd.substring(0, 4),
  yyyymmdd.substring(4, 6) - 1, // months start at 0
  yyyymmdd.substring(6, 8)
)

// resolvePromise :: Function -> Cache.name -> Cache -> [{}]
async function resolvePromise(apiCall, cache_name, cache) {
  const result = (cache[cache_name].data.length && same_day(cache_name, cache))
    ? cache[cache_name].data
    : await apiCall
  return result
}

// callandCache :: Function -> Cache.name -> Cache -> [{}]
async function callandCache(apiCall, cache_name, cache) {
  const result = (cache[cache_name].data.length && same_day(cache_name, cache))
    ? cache[cache_name].data
    : await apiCall()
    // TODO: reset cache on a daily basis
  cache[cache_name] = { ...cache[cache_name], data: result }
  return result
}

// genRegExp :: String -> RegEx
const genRegExp = str => new RegExp(`${str}`, 'i')

// reportByQueryString :: {} -> Promise [Report]
const reportByQueryString = query => new Promise((resolve, reject) => {
  Report.find(query, (err, reports) => {
    if (err) {
      reject(err)
    }
    resolve(reports)
  })
})

// reportByOneParam :: String -> String -> Promise [Report]
const reportByOneParam = (key, value) => new Promise((resolve, reject) => {
  Report.find({ [key]: genRegExp(value) }, (err, reports) => {
    if (err) {
      reject(err)
    }
    resolve(reports)
  })
})

// findByDateRange :: String -> String -> Promise [Report]
const findByDateRange = (start, end) => new Promise((resolve, reject) => {
  Report.find({ "dateTime": {
      '$gte': dateFromParam(start).toISOString(),
      '$lte': dateFromParam(end).toISOString()
    } }, (err, reports) => {
    if (err) {
      reject(err)
    }
    resolve(reports)
  })
})

// allArcgisData :: [Report]
const allArcgisData = () => arcgis.getApdData()

// allMongoData :: Promise [Report]
const allMongoData = () => new Promise((resolve, reject) => {
  Report.find({}, (err, reports) => {
    if (err) {
      reject(err)
    }
    resolve(reports)
  })
})

// combineReports :: -> Cache -> [Report]
async function combineReports(cache) {
  const arc = await callandCache(allArcgisData, 'arcgis', cache)
  const mongo = await callandCache(allMongoData, 'mongo', cache)
  return [...arc, ...mongo]
}


module.exports = {

  allReports: () => combineReports(cache),

  /*
   * APD daily bulletin stored in MongoDB
   */
  bulletin: () => callandCache(allMongoData, 'mongo', cache),

  /*
   * Database queries return filtered results.
   * However, we filter the results because function calls may return cache.
   */
  byQueryString: query => resolvePromise(reportByQueryString(query), 'mongo', cache)
    .then(reports => reports.filter(report => {
      /*
       * TODO: make query string work for dates
       */
      for (let key in query) {
        if (
          report[key] &&
          report[key].search(genRegExp(query[key]['$regex'])) != -1
        ) {
          continue
        } else {
          return false
        }
      }
      return true
    })),

  bulletin_dates: (start, end) => findByDateRange(start, end)
    .then(reports => reports.filter(report =>
      (report.dateTime >= dateFromParam(start) && report.dateTime <= dateFromParam(end))
    )),

  bulletin_description: (word) => resolvePromise(reportByOneParam('description', word), 'mongo', cache)
    .then(reports => reports.filter(report => report.description.search(genRegExp(word)) != -1)),

  bulletin_officer: (officer) => resolvePromise(reportByOneParam('officer', officer), 'mongo', cache)
    .then(reports => reports.filter(report => report.officer.search(genRegExp(officer)) != -1)),

  /*
   * API calls to Open Data Reports
   */
  odr: () => callandCache(allArcgisData, 'arcgis', cache),

  odr_arrests: (param) => callandCache(allArcgisData ,'arcgis', cache)
    .then(reports => reports.filter(report => (
        report.driver_arrested == 1 ||
        report.passenger_arrested == 1
      ))),

  odr_searches: (param) => callandCache(allArcgisData, 'arcgis', cache)
    .then(reports => reports.filter(report => (
        report.driver_searched == 1 ||
        report.passenger_searched == 1||
        report.personal_effects_searched == 1 ||
        report.search_initiated == 1 ||
        report.vehicle_searched == 1
      ))),
}
