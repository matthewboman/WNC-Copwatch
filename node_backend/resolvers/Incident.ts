import { HttpService } from '../services'
import {
  Query,
  Incident,
  UnformattedReport
} from '../entity'
import {
  applyFilters,
  filterOne,
  filterBefore,
  filterAfter
} from '../utils/functions'

const APD_OPEN_DATA_URL = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
const apdOpenDataService = new HttpService(APD_OPEN_DATA_URL)

const formatIncidents = (reports: Array<UnformattedReport>): Array<Incident> => {
  return reports.map((report: UnformattedReport) => {
    const incident: Incident = {
        id: report.attributes.OBJECTID, // wtf
        date: new Date(report.attributes.date_occurred),
        incident_id: report.attributes.incident_id,
        case_number: report.attributes.case_number,
        agency: report.attributes.agency,
        geo_beat: report.attributes.geo_beat,
        geo_report_area: report.attributes.geo_report_area,
        geometry: {
          lat: report.geometry ? report.geometry.x : null,
          lng: report.geometry ? report.geometry.y : null
        },
        offense_group_long_description: report.attributes.offense_group_long_description,
        offense_short_description: report.attributes.offense_short_description,
        offense_long_description: report.attributes.offense_long_description,
        offense_code: report.attributes.offense_code,
        offense_group_code: report.attributes.offense_group_code,
        offense_group_level: report.attributes.offense_group_level,
        force: report.attributes.force,
    }
    return incident
  })
}

export default {
  Query: {
    incidents: async (parent: any, args: Query, context: any) => {
      const url: String = "Layers/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
      const rawIncidents: Array<UnformattedReport> = await apdOpenDataService.get(url).then(data => data.features)
      const formattedIncidents: Array<Incident> = formatIncidents(rawIncidents).slice(0, 100)

      // partially apply filters
      const before = (incidents: Array<Incident>) => filterBefore(args, incidents)
      const after = (incidents: Array<Incident>) => filterAfter(args, incidents)
      // clean up query arg
      const description = (incidents: Array<Incident>) => {
        if (args.description) {
          return filterOne('offense_group_long_description', { 'offense_group_long_description': args.description }, incidents)
        }
        return incidents
      }

      // compose
      return applyFilters(
        [
          after,
          before,
          description
        ],
        formattedIncidents
      )
    },
  }
}
