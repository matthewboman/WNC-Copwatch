import { LatLng } from './LatLng'
import { OpenDataReport } from './OpenDataReport'

export interface Incident extends OpenDataReport {
  incident_id: number
  case_number: string
  agency: string
  geo_beat: string
  geo_report_area: string
  geometry: LatLng
  offense_short_description: string
  offense_long_description: string
  offense_group_long_description: string
  offense_code: string
  offense_group_code: string
  offense_group_level: string
  force: string
}
