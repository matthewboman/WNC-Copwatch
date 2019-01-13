/*
 * Pure functions implemented by controllers, services, and other utilies.
 *
 * The reason functions aren't class methods of an abstract controller class
 * to be inherited by BulletinController and OpenDataController is because
 * `async function` is a syntax error in ES2015. Maybe it'd work in ES2017?
 */


// applyFilters :: [Function] -> [] -> []
const applyFilters = (fns, arr) =>
  fns.reduce((acc, curr) => curr(acc), arr)

// calculateStats :: [{}] -> {}
const calculateStats = reports => {
  const accumulator = {
    stops: 0,
    searches: 0,
    arrests: 0,
    searchWithoutArrest: 0,
    arrestWithoutSearch: 0,
    seachWithConsent: 0,
    searchWithProbableCause: 0,
    searchWithWarrant: 0,
    searchWithoutConsentWarrantOrProbableCause: 0
  }

  return reports.reduce((acc, val) => {
    const searchWithoutArrest = (
      (val.searches >= 1 && val.arrests === 0) ||
      (val.searches > val.arrests)
    ) ? (val.searches - val.arrests) : 0
    const arrestWithoutSearch = (
      (val.searches === 0 && val.arrests >= 1) ||
      (val.searches < val.arrests)
    ) ? (val.arrests - val.searches) : 0
    const seachWithConsent = (
      val.t_search_consent >= 1
    ) ? val.t_search_consent : 0
    const searchWithProbableCause = (
      val.t_probable_cause >= 1
    ) ? val.t_probable_cause : 0
    const searchWithWarrant = (
      val.t_search_warrant >= 1
    ) ? val.t_search_warrant : 0
    const searchWithoutConsentWarrantOrProbableCause = (
      (val.searches >= 1 && val.t_search_consent === 0 && val.t_probable_cause === 0 && val.t_probable_cause === 0) ||
      (val.searches > (val.t_search_consent + val.t_probable_cause + val.t_probable_cause))
    ) ? (val.searches - val.t_search_consent - val.t_probable_cause - val.t_probable_cause) : 0

    return {
      stops: acc.stops += val.stops,
      searches: acc.searches += val.searches,
      arrests: acc.arrests += val.arrests,

      seachWithConsent: acc.seachWithConsent += seachWithConsent,
      searchWithProbableCause: acc.searchWithProbableCause += searchWithProbableCause,
      searchWithWarrant: acc.searchWithWarrant += searchWithWarrant,

      searchWithoutArrest: acc.searchWithoutArrest += searchWithoutArrest,
      arrestWithoutSearch: acc.arrestWithoutSearch += arrestWithoutSearch,
      searchWithoutConsentWarrantOrProbableCause: acc.searchWithoutConsentWarrantOrProbableCause += searchWithoutConsentWarrantOrProbableCause
    }
  }, accumulator)
}

// callandCache :: Function -> Cache.name -> Cache -> [{}]
async function callandCache(apiCall, cache_name, cache) {
  const result = (cache[cache_name].data.length && sameDay(cache_name, cache))
    ? cache[cache_name].data
    : await apiCall()
  cache[cache_name] = { ...cache[cache_name], data: result }
  return result
}

// dateFromFilename :: String -> Date
const dateFromFilename = str => {
  const [y, m, d] = str.split('-')
  return new Date(`${m}/${d}/${y}`)
}

// dateFromParam :: String -> Date
const dateFromParam = yyyymmdd => new Date(
  yyyymmdd.substring(0, 4),
  yyyymmdd.substring(4, 6) - 1, // months start at 0
  yyyymmdd.substring(6, 8)
)

// dateFromArcgis :: String -> Date
const dateFromArcgis = str => {
  const d = new Date(str)
  return d
}

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
      report.t_search_warrant == 1 ||
      report.t_probable_cause == 1
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
        personal_effects_searched: sameDay.personal_effects_searched + parseInt(report.personal_effects_searched),
        search_initiated: sameDay.search_initiated + parseInt(report.search_initiated),
        t_probable_cause: sameDay.t_probable_cause + parseInt(report.t_probable_cause),
        t_search_consent: sameDay.t_search_consent + parseInt(report.t_search_consent),
        t_search_warrant: sameDay.t_search_warrant + parseInt(report.t_search_warrant),
        vehicle_searched: sameDay.vehicle_searched + parseInt(report.vehicle_searched),

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
        stops: 1,

        // searches
        searches: searches,
        driver_searched: parseInt(report.driver_searched),
        passenger_searched: parseInt(report.passenger_searched),
        personal_effects_searched: parseInt(report.personal_effects_searched),
        search_initiated: parseInt(report.search_initiated),
        t_probable_cause: parseInt(report.t_probable_cause),
        t_search_consent: parseInt(report.t_search_consent),
        t_search_warrant: parseInt(report.t_search_warrant),
        vehicle_searched: parseInt(report.vehicle_searched),

        // arrests
        arrests: arrests,
        driver_arrested: parseInt(report.driver_arrested),
        passenger_arrested: parseInt(report.passenger_arrested)
      })
    }
  })
  return dataset.sort((a, b) => new Date(a.date) - new Date(b.date)) // somehow the order was getting off
}

// genRegExp :: String -> RegEx
const genRegExp = str => new RegExp(`${str}`, 'i')

// resolvePromise :: Function -> Cache.name -> Cache -> [{}]
async function resolvePromise(apiCall, cache_name, cache) {
  const result = (cache[cache_name].data.length && sameDay(cache_name, cache))
    ? cache[cache_name].data
    : await apiCall
  return result
}

// sameDay :: Cache.name -> Cache -> Bool
const sameDay = (cache_name, cache) =>
  new Date(Date.now()).getDay() == cache[cache_name].date_cached.getDay()

// validDate :: String -> Date
const validDate = date => {
  const year = date.substring(0, 4)
  const month = date.substring(4, 6) - 1
  const day = date.substring(6, 8)
  const hour = date.substring(8, 10)
  const min = date.substring(10, 12)
  const sec = date.substring(12)
  return new Date(Date.UTC(year, month, day))
}

module.exports = {
  applyFilters,
  calculateStats,
  callandCache,
  dateFromArcgis,
  dateFromFilename,
  dateFromParam,
  genRegExp,
  formatTrafficStops,
  resolvePromise,
  sameDay,
  validDate
}
