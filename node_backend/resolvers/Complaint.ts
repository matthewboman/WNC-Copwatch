import { HttpService } from '../services'
import {
  Query,
  Complaint,
  UnformattedReport
} from '../entity'
import {
  applyFilters,
  filterOne,
  filterAfter,
  filterBefore
} from '../utils/functions'

const APD_OPEN_DATA_URL = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
const apdOpenDataService = new HttpService(APD_OPEN_DATA_URL)

const formatComplaints = (complaints: Array<UnformattedReport>): Array<Complaint> => {
  return complaints.map((c: UnformattedReport) => {
    const complaint: Complaint = {
      id: c.attributes.objectid,
      incident_type: c.attributes.incident_type,
      date: new Date(c.attributes.occurred_date),
      disposition: c.attributes.disposition,
      status: c.attributes.status,
      allegation: c.attributes.allegation,
      ia_no: c.attributes.ia_no
    }
    return complaint
  })
}

export default {
  Query: {
    complaints: async (parent: any, args: Query, context: any) => {
      const url: String = "/APDComplaints/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
      const rawComplaints: Array<UnformattedReport> = await apdOpenDataService.get(url).then(data => data.features)
      const formattedComplaints: Array<Complaint> = formatComplaints(rawComplaints)

      // partially apply filters
      const before = (complaints: Array<Complaint>) => filterBefore(args, complaints)
      const after = (complaints: Array<Complaint>) => filterAfter(args, complaints)
      const allegation = (complaints: Array<Complaint>) => filterOne('allegation', args, complaints)
      const disposition = (complaints: Array<Complaint>) => filterOne('disposition', args, complaints)
      const status = (complaints: Array<Complaint>) => filterOne('status', args, complaints)

      // compose
      return applyFilters(
        [
          before,
          after,
          allegation,
          disposition,
          status
        ],
        formattedComplaints
      )
    },
  }
}
