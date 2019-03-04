import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    trafficStops(
      after: String,
      before: String,
      arrest: Boolean,
      search: Boolean,
      reason: String
    ): [TrafficStop!]!

    trafficStop(id: String!): TrafficStop!

    dailyTrafficStopStats: [DailyTrafficStats]

    allTrafficStopStats: AllTrafficStopStats
  }

  type TrafficStop {
    id: Int
    date: Date

    address: String
    agency: String
    geometry: LatLng
    reason: String
    tsId: String
    off_use_force: Boolean
    off_phys_resis: Boolean

    driver_arrested: Boolean
    passenger_arrested: Boolean

    driver_searched: Boolean
    passenger_searched: Boolean
    no_contraband_found: Boolean
    personal_effects_searched: Boolean
    search_initiated: Boolean
    vehicle_searched: Boolean
    search_category: [String]
  }

  type DailyTrafficStats {
    date: Date

    arrests: Int
    driver_arrested: Int
    passenger_arrested: Int

    searches: Int
    driver_searched: Int
    passenger_searched: Int
    no_contraband_found: Int
    personal_effects_searched: Int
    search_initiated: Int
    vehicle_searched: Int

    t_search_consent: Int
    t_search_warrant: Int
    t_probable_cause: Int
  }

  type AllTrafficStopStats {
    stops: Int
    searches: Int
    arrests: Int
    searchWithoutArrest: Int
    arrestWithoutSearch: Int
    seachWithConsent: Int
    searchWithProbableCause: Int
    searchWithWarrant: Int
    searchWithoutConsentWarrantOrProbableCause: Int
  }
`
