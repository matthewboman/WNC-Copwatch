import LatLng from './LatLng'
import { OpenDataReport } from './OpenDataReport'

export default interface TrafficStop extends OpenDataReport {
  address: String
  agency: String
  geometry: LatLng
  reason: String
  tsId: String
  off_use_force: Boolean
  off_phys_resis: Boolean

  // arrest
  driver_arrested: Boolean
  passenger_arrested: Boolean

  // search
  driver_searched: Boolean
  passenger_searched: Boolean
  no_contraband_found: Boolean
  personal_effects_searched: Boolean
  search_initiated: Boolean
  vehicle_searched: Boolean

  search_category: [string?] // consent, warrant, probable cause
}
