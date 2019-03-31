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
} from '../../../utils/filters'

@Injectable()
export class ComplaintProvider {
  httpService: HttpService
  baseURL: string = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
  complaintURL: string = "/APDComplaints/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  complaints: Complaint[]

  constructor() {
    this.httpService = new HttpService(this.baseURL)
  }

  async getAllComplaints(args: Query): Promise<Complaint[]> {
    if (!this.complaints) {
      const rawComplaints: UnformattedReport[] = await this.httpService.get(this.complaintURL)
        .then(data => data.features)
      this.complaints = this.formatComplaints(rawComplaints)
    }

    // partially apply filters
    const before = (complaints: Complaint[]) => filterBefore(args, complaints)
    const after = (complaints: Complaint[]) => filterAfter(args, complaints)
    const allegation = (complaints: Complaint[]) => filterOne('allegation', args, complaints)
    const disposition = (complaints: Complaint[]) => filterOne('disposition', args, complaints)
    const status = (complaints: Complaint[]) => filterOne('status', args, complaints)

    return applyFilters([
      before,
      after,
      allegation,
      disposition,
      status
    ], this.complaints)
  }

  private formatComplaints(complaints: UnformattedReport[]): Complaint[] {
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
