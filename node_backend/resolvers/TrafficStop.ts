import { HttpService } from '../services'
import {
  Query,
  TrafficStop,
  UnformattedReport,
} from '../entity'
import {
  applyFilters,
  filterAfter,
  filterBefore,
  filterArrests,
  filterSearches,
  filterOne,
  fixBool,
  fixDate
} from '../utils/functions'

const APD_OPEN_DATA_URL = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
const apdOpenDataService = new HttpService(APD_OPEN_DATA_URL)

const formatTrafficStops = (stops: Array<UnformattedReport>): Array<TrafficStop> => {
  return stops.map((stop: UnformattedReport) => {
    let categories: [string?] = []

    if (stop.attributes.t_probable_cause == '1') {
      categories.push("Probable cause")
    }
    if (stop.attributes.t_search_consent == '1') {
      categories.push("Consented to search")
    }
    if (stop.attributes.t_search_warrant == '1') {
      categories.push("Search warrant")
    }

    const trafficStop: TrafficStop = {
      id: stop.attributes.objectid,

      address: stop.attributes.address || '',
      agency: stop.attributes.agency || '',
      date: fixDate(stop.attributes.date_occurred),
      geometry: {
        lat: stop.geometry ? stop.geometry.x : null,
        lng: stop.geometry ? stop.geometry.y : null
      },
      reason: stop.attributes.stop_sbi_desc || '',
      tsId: stop.attributes.traffic_stop_id || '',
      off_use_force: fixBool(stop.attributes.off_use_force),
      off_phys_resis: fixBool(stop.attributes.off_phys_resis),

      driver_arrested: fixBool(stop.attributes.driver_arrested),
      passenger_arrested: fixBool(stop.attributes.passenger_arrested),

      driver_searched: fixBool(stop.attributes.driver_searched),
      passenger_searched: fixBool(stop.attributes.passenger_searched),
      no_contraband_found: fixBool(stop.attributes.no_contraband_found),
      personal_effects_searched: fixBool(stop.attributes.personal_effects_searched),
      search_initiated: fixBool(stop.attributes.search_initiated),
      vehicle_searched: fixBool(stop.attributes.vehicle_searched),
      search_category: categories
    }

    return trafficStop
  })
}

export default {
  Query: {
    trafficStops: async (parent: any, args: Query, context: any) => {
      const url: String = "APDTrafficStops/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
      const rawTrafficStops: Array<UnformattedReport> = await apdOpenDataService.get(url).then(data => data.features)
      const formattedTrafficStops: Array<TrafficStop> = formatTrafficStops(rawTrafficStops).slice(0,100)

      // partially apply filters
      const before = (stops: Array<TrafficStop>) => filterBefore(args, stops)
      const after = (stops: Array<TrafficStop>) => filterAfter(args, stops)
      const searches = (stops: Array<TrafficStop>) => filterSearches(args, stops)
      const arrests = (stops: Array<TrafficStop>) => filterArrests(args, stops)
      const reason = (stops: Array<TrafficStop>) => filterOne('reason', args, stops)
      
      // compose
      return applyFilters(
        [
          after,
          before,
          arrests,
          searches,
          reason,
        ],
        formattedTrafficStops
      )
    },
    trafficStop: async (parent: any, args: Query, context: any) => {
      // TODO
    }
  }
}
