const reportModel = require('../models/report')
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
  cache[cache_name] = { ...cache[cache_name], data: result }
  return result
}

// genRegExp :: String -> RegEx
const genRegExp = str => new RegExp(`${str}`, 'i')

// reportByOneParam :: String -> String -> Promise [Report]
const reportByOneParam = (key, value) => {
  return new Promise((resolve, reject) => {
    reportModel.find({ [key]: genRegExp(value) }, (err, reports) => {
      if (err) {
        reject(err)
      }
      resolve(reports)
    })
  })
}

// findByDateRange :: String -> String -> Promise [Report]
const findByDateRange = (start, end) => {
  return new Promise((resolve, reject) => {
    reportModel.find({ dateTime: { $gte: dateFromParam(start), $lte: dateFromParam(end) }}, (err, reports) => {
      if (err) {
        reject(err)
      }
      resolve(reports)
    })
  })
}

const allArcgisData = () => arcgis.getApdData()

const allMongoData = () => {
  return new Promise((resolve, reject) => {
    reportModel.find({}, (err, reports) => {
      if (err) {
        reject(err)
      }
      resolve(reports)
    })
  })
}

// combineReports :: -> Cache -> [Report]
async function combineReports(cache) {
  console.log('combining')
  const arc = await callandCache(allArcgisData, 'arcgis', cache)
  const mongo = await callandCache(allMongoData, 'mongo', cache)
  return [...arc, ...mongo]
}


module.exports = {

  allReports: () => combineReports(cache),

  bulletin: () => callandCache(allMongoData, 'mongo', cache),

  bulletin_dates: (start, end) => findByDateRange(start, end),

  bulletin_description: (word) => resolvePromise(reportByOneParam('description', word), 'mongo', cache),

  bulletin_officer: (officer) => resolvePromise(reportByOneParam('officer', officer), 'mongo', cache),

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
