const R = require('ramda')

/*
 * Higer-order functions for filtering reports
 */

// conditionalArray :: Boolean -> [a] -> [a]
const conditionalArray = (bool, array) => bool
  ? array
  : []

// pastWeek :: [Date] -> (Date, Date)
const pastWeek = dates => {
  const last = R.last(dates)
  let previous = new Date(last)
  previous.setDate(previous.getDate() - 7)
  return [last, previous.toISOString()]
}

// previousWeek :: Date -> Date
const previousWeek = date => {
  let previous = new Date(date)
  return previous.setDate(previous.getDate() - 7)
}

const YYYYMMDD = date => {
  // b/c months start at 0
  const month = date.getMonth() < 9
    ? `0${date.getMonth() + 1}`
    : `${date.getMonth() + 1}`
  return `${date.getFullYear()}${month}${date.getUTCDate()}`
}

// removeDuplicates :: [a] -> [a]
const removeDuplicates = array => array.filter((item, pos, arr) => arr.indexOf(item) == pos).sort()

// filterByOfficer :: String -> [{}] -> [{}]
const filterByOfficer = (officer, reports) => !officer
  ? reports
  : reports.filter(r => r.officer == officer)

// filterByCodes :: [String] -> [{}] -> [{}]
const filterByCodes = (codes, reports) => reports.filter(r => codes.includes(r.code))

// filterByDates :: Date -> Date -> [{}] -> [{}]
const filterByDates = (start, end, reports) => (!start || !end)
  ? reports
  : reports.filter(r => ((r.dateTime >= start) && (r.dateTime <= end)))

// filterByDescription :: String -> [{}] -> [{}]
const filterByDescription = (description, reports) => description.length
  ? reports.filter(r => r.description.toLowerCase().includes(description.toLowerCase()))
  : reports

// const odrHashMap :: String -> Boolean
const odrHashMap = {
  warrant: report => (
    report.t_search_warrant == 1
  ),
  consent: report => (
    report.t_search_consent == 1
  ),
  probable: report => (
    report.t_probable_cause == 1
  ),
  resist: report => (
    report.off_phys_resis == 1
  ),
  search: report => (
    report.driver_searched == 1 ||
    report.passenger_searched == 1 ||
    report.personal_effects_searched == 1 ||
    report.search_initiated == 1 ||
    report.vehicle_searched == 1
  ),
  arrest: report => (
    report.driver_arrested == 1 ||
    report.passenger_arrested == 1 ||
    report.t_inc_arrest == 1
  )
}

// isTrue :: a -> Boolean
const isTrue = value => value == true

// filterByODRDetails :: [String] -> [{}] -> [{}]
const filterByODRDetails = (details, reports) => reports.filter(report =>
  R.all(isTrue)(details.map(detail => odrHashMap[detail](report)))
)

// toggleArray :: [a] -> a -> [a]
const toggleArray = (array, value) => array.includes(value)
  ? array.filter(v => v != value)
  : [...array, value]

/*
 * We export this with CommonJS Module Syntax b/c Jest tests are not compiled
 * before Node runs them.
 */
module.exports = {
  conditionalArray,
  filterByCodes,
  filterByDates,
  filterByDescription,
  filterByODRDetails,
  filterByOfficer,
  isTrue,
  odrHashMap,
  pastWeek,
  previousWeek,
  removeDuplicates,
  toggleArray,
  YYYYMMDD
}
