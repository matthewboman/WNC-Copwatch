/**
* Functions shared across components
*/
import {
  LatLng,
  OpenDataReport,
  OriginalBulletin,
  Name,
  Query,
  TrafficStop
} from '../entity'


// dateWithoutTime :: Date -> Date
const dateWithoutTime = (d: Date): Date =>
  new Date(`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`)

// boolToInt :: Bool -> Number
const boolToInt = (bool: Boolean): Number => bool === true ? 1 : 0

// flatten :: [[]] -> []
const flatten = (arr: []): any => [].concat.apply([], arr)

// fixBool :: String | Number -> Bool
const fixBool = (b: (string | Number)): Boolean => (b == 0) ? false : true

// fixDate :: String -> Date
const fixDate = (yyyymmdd: String): Date => {
  const specific = yyyymmdd.length > 8

  const y = parseInt(yyyymmdd.substring(0, 4))
  const m = parseInt(yyyymmdd.substring(4, 6)) - 1
  const d = parseInt(yyyymmdd.substring(6, 8))

  const h = specific
    ? parseInt(yyyymmdd.substring(8, 10))
    : 0
  const min = specific
    ? parseInt(yyyymmdd.substring(10, 12))
    : 0
  const sec = specific
    ? parseInt(yyyymmdd.substring(12,))
    : 0

  return new Date(y, m, d, h, min, sec)
}

// dateFromQuery :: String -> Date
const dateFromQuery = (date: string): Date => new Date(date)

// TODO: write in more declaritive way
// TODO: generate types for https://github.com/mikolalysenko/robust-point-in-polygon
const withinShape = (point: any, bounds: any) => {
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  const x = point[0]
  const y = point[1]
  let inside = false

  for (let i = 0, j = bounds.length - 1; i < bounds.length; j = i++) {
      let xi = bounds[i][0], yi = bounds[i][1];
      let xj = bounds[j][0], yj = bounds[j][1];

      let intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }

  return inside
}

// mergeByKey :: [{}] -> [{}] -> [{}]
const mergeByKey = (arr1: Array<any>, arr2: Array<any>): Array<any> => {
  return arr1.map(x => Object.assign(x, arr2.find(y => y.id == x.id)))
}

// const nthIndexOf :: String -> String -> Int -> Int
const nthIndexOf = (str: string, pattern: string, n: number): number => {
  let i = -1

  while (n-- && i++ < str.length) {
    i = str.indexOf(pattern, i)
    if (i < 0) break
  }
  return i
}

const parseID = (bulletin: OriginalBulletin): Number => {
  const p1 = bulletin.description.indexOf('(') + 1
  const p2 = bulletin.description.indexOf(')')

  return parseInt(
    bulletin.description.slice(p1, p2)
  )
}

// parseName :: String -> Name
const parseName = (name: string): Name => {
  const comma = name.indexOf(',')
  const firstSpace = name.indexOf(' ') + 1
  const secondSpace = nthIndexOf(name, ' ', 2) + 1
  return {
    firstName: name.slice(firstSpace, secondSpace - 1).toLowerCase(),
    firstInitial: name.slice(firstSpace, firstSpace + 1).toLowerCase(),
    middleInitial: name.slice(secondSpace, secondSpace + 1).toLowerCase() || '',
    lastName: name.slice(0, comma).toLowerCase(),
  }
}

// tupleToObj :: [[]] -> LatLng
const tupleToObj = (arr: []): Array<LatLng> => arr.map((geo: Number[]) => {
  return {
    lat: geo[0],
    lng: geo[1]
  }
})


/**
 * Filters for Open Data
 */

// applyFilters :: [ Function ] -> [ OpenDataReport ] -> [ OpenDataReport ]
const applyFilters = (
  fns: Array<Function>,
  arr: Array<any>
): Array<any> => {
  return fns.reduce((acc: Array<OpenDataReport>, curr: Function) => curr(acc), arr)
}

// filterAfter :: Query -> [ OpenDataReport ] -> [ OpenDataReport ]
const filterAfter = (
  query: Query,
  arr: Array<OpenDataReport>
): Array<OpenDataReport> => arr.filter((r: OpenDataReport) => {
  if (query.after) {
    const occured = r.date
    const param = dateFromQuery(query.after.toString())
    return occured >= param
  }
  return true // apply filter only if part of query
})

// filterBefore :: Query -> [ OpenDataReport ] -> [ OpenDataReport ]
const filterBefore = (
  query: Query,
  arr: Array<OpenDataReport>
): Array<OpenDataReport> => arr.filter((r: OpenDataReport) => {
  if (query.before) {
    const occured = r.date
    const param = dateFromQuery(query.before.toString())
    return occured <= param
  }
  return true // apply filter only if part of query
})

const filterExactDate = (
  query: Query,
  arr: Array<OpenDataReport>
) => {
  if (query.exact) {
    const date = dateFromQuery(query.exact as string)
    return arr.filter((r: OpenDataReport) => {
      return dateWithoutTime(r.date).getTime() == date.getTime()
    })
  }
  return arr
}

// TODO: This was developed for a URL and can probably be implemented in a cleaner
// way depending on to what degree we update field names and make each queryable
// filterOne :: String -> Query -> [ OpenDataReport ] -> [ OpenDataReport ]
const filterOne = (
  type: string,
  query: any, // type Query won't work b/c how we access the value
  arr: Array<OpenDataReport>
): Array<OpenDataReport> => arr.filter((r: any) => {
  if (query[type]) {
    if (r[type]) {
      return r[type].toLowerCase().includes(query[type].toLowerCase())
    }
    return false // handle `null`
  }
  return true // apply filter only if part of query
})

// filterArrests :: Query -> [ TrafficStop ] -> [ TrafficStop ]
const filterArrests = (
  query: Query,
  arr: Array<TrafficStop>
): Array<TrafficStop> => arr.filter((report: TrafficStop) => {
  if (query.arrest === true) {
    return (
      report.driver_arrested ||
      report.passenger_arrested
    )
  }
  return true // apply filter only if part of query
})

// filterSearches :: Query -> [ TrafficStop ] -> [ TrafficStop ]
const filterSearches = (
  query: Query,
  arr: Array<TrafficStop>
): Array<TrafficStop> => arr.filter((report: TrafficStop) => {
  if (query.search === true) {
    return (
      report.driver_searched ||
      report.passenger_searched ||
      report.personal_effects_searched ||
      report.search_initiated ||
      report.vehicle_searched
    )
  }
  return true // apply filter only if part of query
})

// filterUseOfForce :: Query -> [ TrafficStop ] -> [ TrafficStop ]
const filterUseOfForce = (
  query: Query,
  arr: Array<TrafficStop>
): Array<TrafficStop> => arr.filter((report: TrafficStop) => {
  if (query.use_of_force === true) {
    return report.off_use_force
  }
  return true // apply filter only if part of query
})

export {
  // shared functions
  boolToInt,
  dateWithoutTime,
  fixBool,
  fixDate,
  flatten,
  mergeByKey,
  nthIndexOf,
  parseID,
  parseName,
  tupleToObj,
  withinShape,

  // filters for Open Data reducers
  applyFilters,
  filterAfter,
  filterArrests,
  filterBefore,
  filterExactDate,
  filterOne,
  filterSearches,
  filterUseOfForce,
}
