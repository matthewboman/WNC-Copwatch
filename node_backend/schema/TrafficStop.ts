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
`
