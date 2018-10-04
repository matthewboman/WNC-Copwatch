const Report = require('../models/report')
const fns = require('../utils/functions')

let cache = {
  mongo: {
    date_cached: new Date(Date.now()),
    data: []
  }
}

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
  Report.find({ [key]: fns.genRegExp(value) }, (err, reports) => {
    if (err) {
      reject(err)
    }
    resolve(reports)
  })
})

// findByDateRange :: String -> String -> Promise [Report]
const findByDateRange = (start, end) => new Promise((resolve, reject) => {
  Report.find({ "dateTime": {
      '$gte': fns.dateFromParam(start).toISOString(),
      '$lte': fns.dateFromParam(end).toISOString()
    } }, (err, reports) => {
    if (err) {
      reject(err)
    }
    resolve(reports)
  })
})

// allMongoData :: Promise [Report]
const allMongoData = () => new Promise((resolve, reject) => {
  Report.find({}, (err, reports) => {
    if (err) {
      reject(err)
    }
    resolve(reports)
  })
})

module.exports = {
  /*
   * APD daily bulletin stored in MongoDB
   */
  bulletin: () => fns.callandCache(allMongoData, 'mongo', cache),

  /*
   * Database queries return filtered results.
   * However, we filter the results because function calls may return cache.
   */
  byQueryString: query => fns.resolvePromise(reportByQueryString(query), 'mongo', cache)
    .then(reports => reports.filter(report => {
      /*
       * TODO: make query string work for dates
       */
      for (let key in query) {
        if (
          report[key] &&
          report[key].search(fns.genRegExp(query[key]['$regex'])) != -1
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
      ( report.dateTime >= fns.dateFromParam(start) &&
        report.dateTime <= fns.dateFromParam(end) )
    )),

  bulletin_description: (word) => fns.resolvePromise(reportByOneParam('description', word), 'mongo', cache)
    .then(reports => reports.filter(report =>
      report.description.search(fns.genRegExp(word)) != -1)
    ),

  bulletin_officer: (officer) => fns.resolvePromise(reportByOneParam('officer', officer), 'mongo', cache)
    .then(reports => reports.filter(report =>
      report.officer.search(fns.genRegExp(officer)) != -1)
    ),
}
