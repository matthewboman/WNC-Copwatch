/**
 * APD daily bulletin stored in MongoDB
 */

const Report = require('../models/report')
const fns = require('../utils/functions')

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

  bulletin: () => allMongoData(),

  byQueryString: query => reportByQueryString(query),

  bulletin_dates: (start, end) => findByDateRange(start, end)
    .then(reports => reports.filter(report =>
      ( report.dateTime >= fns.dateFromParam(start) &&
        report.dateTime <= fns.dateFromParam(end) )
    )),

  bulletin_description: word => reportByOneParam('description', word),

  bulletin_officer: officer => reportByOneParam('officer', officer),

}
