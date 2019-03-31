/**
* Functions shared across components
*/
import {
  LatLng,
  Officer,
  OpenDataReport,
  OriginalBulletin,
  Name,
  Query,
  TrafficStop
} from '../entity'
import {
  dateFromQuery,
  dateWithoutTime
} from './functions'

/**
 * Filters for Open Data
 */

// applyFilters :: [ Function ] -> [ OpenDataReport ] -> [ OpenDataReport ]
const applyFilters = (
  fns: Function[],
  arr: any[]
): any[] =>
  fns.reduce((acc: OpenDataReport[], curr: Function) => curr(acc), arr)

// filterAfter :: Query -> [ OpenDataReport ] -> [ OpenDataReport ]
const filterAfter = (
  query: Query,
  arr: OpenDataReport[]
): OpenDataReport[] => arr.filter((r: OpenDataReport) => {
  if (!query.after) return true // apply filter only if part of query

  return r.date >= dateFromQuery(query.after.toString())
})

// filterBefore :: Query -> [ OpenDataReport ] -> [ OpenDataReport ]
const filterBefore = (
  query: Query,
  arr: OpenDataReport[]
): OpenDataReport[] => arr.filter((r: OpenDataReport) => {
  if (!query.before) return true // apply filter only if part of query

  return r.date <= dateFromQuery(query.before.toString())
})

// filterById :: Query -> [ Officer ] -> [ Officer ]
const filterById = (args: Query, officers: Officer[]): Officer[] => args.id
  ? officers.filter((officer: Officer) => officer.id === args.id)
  : officers

// filterByLastName :: Query -> [ Officer ] -> [ Officer ]
const filterByLastName = (args: any, officers: Officer[]) => args.lastName
  ? officers.filter((officer: Officer) => officer.lastName === args.lastName.toLowerCase())
  : officers

// filterByFirstInitial :: Query -> [ Officer ] -> [ Officer ]
const filterByFirstInitial = (args: any, officers: Officer[]) => args.firstInitial
  ? officers.filter((officer: Officer) => officer.firstInitial === args.firstInitial.toLowerCase())
  : officers

// filterByMiddleInitial :: Query -> [ Officer ] -> [ Officer ]
const filterByMiddleInitial = (args: any, officers: Officer[]) => args.middleInitial
  ? officers.filter((officer: Officer) => officer.middleInitial === args.middleInitial.toLowerCase())
  : officers

// filterExactDate :: Query -> [ OpenDataReport ] -> [ OpenDataReport ]
const filterExactDate = (
  query: Query,
  arr: OpenDataReport[]
) => {
  if (query.exact) {
    const date = dateFromQuery(query.exact as string)
    return arr.filter((r: OpenDataReport) =>
      dateWithoutTime(r.date).getTime() == date.getTime()
    )
  }
  return arr
}

// TODO: This was developed for a URL and can probably be implemented in a cleaner
// way depending on to what degree we update field names and make each queryable
// filterOne :: String -> Query -> [ OpenDataReport ] -> [ OpenDataReport ]
const filterOne = (
  type: string,
  query: any, // type Query won't work b/c how we access the value
  arr: OpenDataReport[]
): OpenDataReport[] => arr.filter((r: any) => {
  if (!query[type]) return true // apply filter only if part of query

  if (r[type]) {
    return r[type].toLowerCase().includes(query[type].toLowerCase())
  }
  return false // handle `null`
})

// filterArrests :: Query -> [ TrafficStop ] -> [ TrafficStop ]
const filterArrests = (
  query: Query,
  arr: TrafficStop[]
): TrafficStop[] => arr.filter((report: TrafficStop) => {
  if (query.arrest === true) {
    return report.driver_arrested || report.passenger_arrested
  }
  return true // apply filter only if part of query
})

// filterSearches :: Query -> [ TrafficStop ] -> [ TrafficStop ]
const filterSearches = (
  query: Query,
  arr: TrafficStop[]
): TrafficStop[] => arr.filter((report: TrafficStop) => {
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
  arr: TrafficStop[]
): TrafficStop[] => arr.filter((report: TrafficStop) => {
  if (query.use_of_force === true) {
    return report.off_use_force
  }
  return true // apply filter only if part of query
})

export {
  applyFilters,
  filterAfter,
  filterArrests,
  filterBefore,
  filterById,
  filterByLastName,
  filterByFirstInitial,
  filterByMiddleInitial,
  filterExactDate,
  filterOne,
  filterSearches,
  filterUseOfForce,
}
