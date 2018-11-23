const R = require('ramda')

/*
 * Higer-order functions for filtering reports, processing dates & strings, etc.
 */

// categoryPerDay :: String -> [{}] -> [{ Date, Int }]
const categoryPerDay = (category, array) => array
  .map(i => ({
    date: i.dateTime,
    [category]: 1,
    // ...i
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

// filterByODRDetails :: [String] -> [{}] -> [{}]
const filterByODRDetails = (details, reports) => reports.filter(report =>
  R.all(isTrue)(details.map(detail => odrHashMap[detail](report)))
)

// filterByOfficer :: String -> [{}] -> [{}]
const filterByOfficer = (officer, reports) => !officer
  ? reports
  : reports.filter(r => r.officer == officer)

// formatDataset :: [{}] -> String -> [{}]
const formatDataset = (arr, name) => categoryPerDay(name, arr).map(d => ({
  date: new Date(d.date),
  category: d[name]
}))

// formatTrafficStops :: [{}] -> [{}]
const formatTrafficStops = reports => {
  let dataset = [ ]
  reports.forEach(report => {
    const existingDates = dataset.map(d => d.date.getTime())
    const date = new Date(report.dateTime)

    // only count for one search or arrest
    let searches = 0
    let arrests = 0
    if (
      report.driver_searched == 1 ||
      report.passenger_searched == 1 ||
      report.search_initiated == 1 ||
      report.vehicle_searched == 1 ||
      report.personal_effects_searched == 1 ||
      report.t_search_consent == 1 ||
      report.t_search_warrant == 1
    ) {
      searches = 1
    }

    if (
      report.driver_arrested == 1 ||
      report.passenger_arrested == 1
    ) {
      arrests = 1
    }

    // update the previous object b/c it's from the same day
    if (existingDates.includes(date.getTime())) {
      let sameDay = dataset[dataset.length - 1]
      const index = dataset.indexOf(sameDay)

      sameDay = {
        date: sameDay.date,
        stops: sameDay.stops + 1,
        // searches
        searches: sameDay.searches + searches,
        driver_searched: sameDay.driver_searched + parseInt(report.driver_searched),
        passenger_searched: sameDay.passenger_searched + parseInt(report.passenger_searched),
        search_initiated: sameDay.search_initiated + parseInt(report.search_initiated),
        vehicle_searched: sameDay.vehicle_searched + parseInt(report.vehicle_searched),
        personal_effects_searched: sameDay.personal_effects_searched + parseInt(report.personal_effects_searched),
        t_search_consent: sameDay.t_search_consent + parseInt(report.t_search_consent),
        t_search_warrant: sameDay.t_search_warrant + parseInt(report.t_search_warrant),
        // arrests
        arrests: sameDay.arrests + arrests,
        driver_arrested: sameDay.driver_arrested + parseInt(report.driver_arrested),
        passenger_arrested: sameDay.passenger_arrested + parseInt(report.passenger_arrested)
      }

      // replace w/ updated version
      dataset[index] = sameDay
    } else {
      // create a new object
      dataset.push({
        date: date,
        // details: {
          stops: 1,
          // searches
          searches: searches,
          driver_searched: parseInt(report.driver_searched),
          passenger_searched: parseInt(report.passenger_searched),
          search_initiated: parseInt(report.search_initiated),
          vehicle_searched: parseInt(report.vehicle_searched),
          personal_effects_searched: parseInt(report.personal_effects_searched),
          t_search_consent: parseInt(report.t_search_consent),
          t_search_warrant: parseInt(report.t_search_warrant),
          // arrests
          arrests: arrests,
          driver_arrested: parseInt(report.driver_arrested),
          passenger_arrested: parseInt(report.passenger_arrested)
        // }
      })
    }
  })
  return dataset
}

// isTrue :: a -> Boolean
const isTrue = value => value == true

// const odrHashMap :: String -> Boolean
// (not actually a function)
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

// removeDuplicates :: [a] -> [a]
const removeDuplicates = array => array.filter((item, pos, arr) => arr.indexOf(item) == pos).sort()

// removeTrailingComma :: String -> String
const removeTrailingComma = str => (str.slice(-1) == ',')
  ? str.slice(0, -1)
  : str

// sortByProp :: String -> [{}] -> [{}]
const sortByProp = property => R.sortBy(R.prop(property))

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
  filterByODRDetails,
  filterByOfficer,
  formatDataset,
  formatTrafficStops,
  isTrue,
  odrHashMap,
  pastWeek,
  previousWeek,
  removeDuplicates,
  removeTrailingComma,
  toggleArray,
  sortByProp,
  YYYYMMDD
}
