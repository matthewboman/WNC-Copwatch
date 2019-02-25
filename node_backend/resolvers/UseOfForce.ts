import { HttpService } from '../services'
import {
  Query,
  UnformattedReport,
  UseOfForce
} from '../entity'
import {
  applyFilters,
  filterOne,
  filterBefore,
  filterAfter
} from '../utils/functions'

const APD_OPEN_DATA_URL = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
const apdOpenDataService = new HttpService(APD_OPEN_DATA_URL)

const formatUseOfForce = (reports: Array<UnformattedReport>): Array<UseOfForce> => {
  return reports.map((report: UnformattedReport) => {
    const useOfForce: UseOfForce = {
      id: report.attributes.objectid,
      date: new Date(report.attributes.occurred_date),
      ia_no: report.attributes.ia_no,
      subject_id: report.attributes.subject_id,
      incident_type: report.attributes.incident_type,
      geo_beat: report.attributes.county_location,
      type_force_used: report.attributes.type_force_used,
      subject_resistence: report.attributes.subject_resistence,
      officer_condition_injury: report.attributes.officer_condition_injury,
      subject_sex: report.attributes.subject_sex,
      subject_race: report.attributes.subject_race,
      disposition: report.attributes.disposition,
      status: report.attributes.status,
      subject_injury: report.attributes.subject_injury
    }
    return useOfForce
  })
}

export default {
  Query: {
    useOfForce: async (parent: any, args: Query, context: any) => {
      const url: String = "APDUseOfForce/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
      const rawUseOfForce: Array<UnformattedReport> = await apdOpenDataService.get(url).then(data => data.features)
      const formattedUseOfForce: Array<UseOfForce> = formatUseOfForce(rawUseOfForce)

      // partially apply filters
      const before = (reports: Array<UseOfForce>) => filterBefore(args, reports)
      const after = (reports: Array<UseOfForce>) => filterAfter(args, reports)
      const disposition = (reports: Array<UseOfForce>) => filterOne('disposition', args, reports)
      const geo_beat = (reports: Array<UseOfForce>) => filterOne('geo_beat', args, reports)
      const officer_condition_injury = (reports: Array<UseOfForce>) => filterOne('officer_condition_injury', args, reports)
      const status = (reports: Array<UseOfForce>) => filterOne('status', args, reports)
      const subject_race = (reports: Array<UseOfForce>) => filterOne('subject_race', args, reports)
      const subject_sex = (reports: Array<UseOfForce>) => filterOne('subject_sex', args, reports)
      const subject_injury = (reports: Array<UseOfForce>) => filterOne('subject_injury', args, reports)
      const subject_resistence = (reports: Array<UseOfForce>) => filterOne('subject_resistence', args, reports)
      const type_force_used = (reports: Array<UseOfForce>) => filterOne('type_force_used', args, reports)

      // compose
      return applyFilters(
        [
          before,
          after,
          disposition,
          geo_beat,
          officer_condition_injury,
          status,
          subject_race,
          subject_sex,
          subject_injury,
          subject_resistence,
          type_force_used
        ],
        formattedUseOfForce
      )
    }
  }
}
