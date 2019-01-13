const all = require('ramda/src/all')
const last = require('ramda/src/last')
const prop = require('ramda/src/prop')
const sortBy = require('ramda/src/sortBy')

/*
 * Higer-order functions for filtering reports, processing dates & strings, etc.
 */

// NOT IMPLEMENTED // categoryPerDay :: String -> [{}] -> [{ Date, Int }]
const categoryPerDay = (category, array) => array
  .map(i => ({
    date: i.dateTime,
    [category]: 1,
  }))
  .reduce((acc, val, index, arr) => {
    if (acc.map(i => i.date).includes(val.date)) {
      acc[acc.length - 1][category] += 1 // assuming these are sorted, just increase category count of last item
      return [...acc]
    }
    return [...acc, val]
  }, [])

// conditionalArray :: Boolean -> [a] -> [a]
const conditionalArray = (bool, array) => bool
  ? array
  : []

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

// filterByTrafficDetails :: [String] -> [{}] -> [{}]
const filterByTrafficDetails = (details, reports) => reports.filter(report =>
  all(isTrue)(details.map(detail => trafficHashMap[detail](report)))
)

// filterByOfficer :: String -> [{}] -> [{}]
const filterByOfficer = (officer, reports) => !officer
  ? reports
  : reports.filter(r => r.officer == officer)

// NOT IMPLEMENTED // formatDataset :: [{}] -> String -> [{}]
const formatDataset = (arr, name) => categoryPerDay(name, arr).map(d => ({
  date: new Date(d.date),
  category: d[name]
}))

// isMobile :: Bolean
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  ? true : false

// isTrue :: a -> Boolean
const isTrue = value => value == true

// const trafficHashMap :: String -> Boolean
const trafficHashMap = {
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

// pastWeek :: [Date] -> (Date, Date)
const pastWeek = dates => {
  const lastDate = last(dates)
  let previous = new Date(lastDate)
  previous.setDate(previous.getDate() - 7)
  return [lastDate, previous.toISOString()]
}

// previousWeek :: Date -> Date
const previousWeek = date => {
  let previous = new Date(date)
  return previous.setDate(previous.getDate() - 7)
}

// removeDuplicates :: [a] -> [a]
const removeDuplicates = array => array.filter((item, pos, arr) => arr.indexOf(item) == pos).sort()

// removeTrailingComma :: String -> String
const removeTrailingComma = str => (str.slice(-1) == ',')
  ? str.slice(0, -1)
  : str

// scaleWidth :: Int -> Int
const scaleWidth = padding => {
  const width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth
  return width - (padding / 2)
}

// sortByProp :: String -> [{}] -> [{}]
const sortByProp = property => sortBy(prop(property))

// toggleArray :: [a] -> a -> [a]
const toggleArray = (array, value) => array.includes(value)
  ? array.filter(v => v != value)
  : [...array, value]

// YYYYMMDD :: Date -> String
const YYYYMMDD = date => {
  const month = date.getMonth() < 9 // b/c months start at 0
    ? `0${date.getMonth() + 1}`
    : `${date.getMonth() + 1}`
  return `${date.getFullYear()}${month}${date.getUTCDate()}`
}

/*
 * We export this with CommonJS Module Syntax b/c Jest tests are not compiled
 * before Node runs them.
 */
module.exports = {
  categoryPerDay,
  conditionalArray,
  filterByCodes,
  filterByDates,
  filterByDescription,
  filterByTrafficDetails,
  filterByOfficer,
  formatDataset,
  isMobile,
  isTrue,
  trafficHashMap,
  pastWeek,
  previousWeek,
  removeDuplicates,
  removeTrailingComma,
  toggleArray,
  scaleWidth,
  sortByProp,
  YYYYMMDD
}
