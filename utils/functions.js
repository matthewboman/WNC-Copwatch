/*
 * Pure functions implemented by controllers and other utilies.
 * The reason functions aren't class methods of an abstract controller class
 * to be inherited by BulletinController and OpenDataController is because
 * `async function` is a syntax error in ES2015. Maybe it'd work in ES2017?
 */

// callandCache :: Function -> Cache.name -> Cache -> [{}]
async function callandCache(apiCall, cache_name, cache) {
  const result = (cache[cache_name].data.length && same_day(cache_name, cache))
    ? cache[cache_name].data
    : await apiCall()
  cache[cache_name] = { ...cache[cache_name], data: result }
  return result
}

// dateFromParam :: String -> Date
const dateFromParam = yyyymmdd => new Date(
  yyyymmdd.substring(0, 4),
  yyyymmdd.substring(4, 6) - 1, // months start at 0
  yyyymmdd.substring(6, 8)
)

// genRegExp :: String -> RegEx
const genRegExp = str => new RegExp(`${str}`, 'i')

// resolvePromise :: Function -> Cache.name -> Cache -> [{}]
async function resolvePromise(apiCall, cache_name, cache) {
  const result = (cache[cache_name].data.length && same_day(cache_name, cache))
    ? cache[cache_name].data
    : await apiCall
  return result
}

// same_day :: Cache.name -> Cache -> Bool
const same_day = (cache_name, cache) =>
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
  callandCache,
  dateFromParam,
  genRegExp,
  resolvePromise,
  same_day,
  validDate
}
