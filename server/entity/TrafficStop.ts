import { LatLng } from './LatLng'
import { OpenDataReport } from './OpenDataReport'

export interface TrafficStop extends OpenDataReport {
  address: string
  agency: string
  geometry: LatLng
  reason: string
  traffic_stop_id: Number
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
  t_search_consent: Boolean
  t_search_warrant: Boolean
  t_probable_cause: Boolean

  search_category: [string?] // consent, warrant, probable cause

  // TODO: potentially brought in from combining data
  name_type?: string
  name_type_sequence?: string
  name_age?: string
  name_race?: string
  name_sex?: string
  name_ethnicity?: string
}

export interface DailyTrafficStats {
  date: Date

  arrests: Number
  driver_arrested: Number
  passenger_arrested: Number

  searches: Number
  driver_searched: Number
  passenger_searched: Number
  no_contraband_found: Number
  personal_effects_searched: Number
  search_initiated: Number
  vehicle_searched: Number
  t_search_consent: Number
  t_search_warrant: Number
  t_probable_cause: Number
}

/**
 * @deprecated
 */
export interface AllTrafficStopStats {
  stops: number
  searches: number
  arrests: number
  searchWithoutArrest: number
  arrestWithoutSearch: number
  seachWithConsent: number
  searchWithProbableCause: number
  searchWithWarrant: number
  searchWithoutConsentWarrantOrProbableCause: number
}
