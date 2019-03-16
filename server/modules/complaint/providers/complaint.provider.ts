import { Injectable } from '@graphql-modules/di'

import { HttpService } from '../../../services'
import {
  Query,
  Complaint,
  UnformattedReport
} from '../../../entity'
import {
  applyFilters,
  filterOne,
  filterAfter,
  filterBefore
} from '../../../utils/functions'

@Injectable()
export class ComplaintProvider {
  httpService: HttpService
  baseURL: string = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
  complaintURL: string = "/APDComplaints/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  complaints: Array<Complaint>

  constructor() {
    this.httpService = new HttpService(this.baseURL)
  }

  async getAllComplaints(args: Query): Promise<Array<Complaint>> {
    if (!this.complaints) {
      const rawComplaints: Array<UnformattedReport> = await this.httpService.get(this.complaintURL)
        .then(data => data.features)
      this.complaints = this.formatComplaints(rawComplaints)
    }

    // partially apply filters
    const before = (complaints: Array<Complaint>) => filterBefore(args, complaints)
    const after = (complaints: Array<Complaint>) => filterAfter(args, complaints)
    const allegation = (complaints: Array<Complaint>) => filterOne('allegation', args, complaints)
    const disposition = (complaints: Array<Complaint>) => filterOne('disposition', args, complaints)
    const status = (complaints: Array<Complaint>) => filterOne('status', args, complaints)

    return applyFilters([
      before,
      after,
      allegation,
      disposition,
      status
    ], this.complaints)
  }

  private formatComplaints(complaints: Array<UnformattedReport>): Array<Complaint> {
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
}
