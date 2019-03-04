import LatLng from './LatLng'
import { OpenDataReport } from './OpenDataReport'

export default interface Incident extends OpenDataReport {
  incident_id: Number
  case_number: String
  agency: String
  geo_beat: String
  geo_report_area: String
  geometry: LatLng
  offense_short_description: String
  offense_long_description: String
  offense_group_long_description: String
  offense_code: String
  offense_group_code: String
  offense_group_level: String
  force: String
}
