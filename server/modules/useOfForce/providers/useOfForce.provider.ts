import { Injectable } from '@graphql-modules/di'

import { HttpService } from '../../../services'
import {
  Query,
  UseOfForce,
  UnformattedReport
} from '../../../entity'
import {
  applyFilters,
  filterOne,
  filterBefore,
  filterAfter,
  filterExactDate
} from '../../../utils/functions'

@Injectable()
export class UseOfForceProvider {
  httpService: HttpService
  baseURL: string = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
  useOfForceURL: string = "APDUseOfForce/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  formattedUseOfForce: Array<UseOfForce>

  constructor() {
    this.httpService = new HttpService(this.baseURL)
  }

  async getAllUseOfForce(query: any): Promise<Array<UseOfForce>> {
    if (!this.formattedUseOfForce) {
      const rawUseOfForce: Array<UnformattedReport> = await this.httpService.get(this.useOfForceURL)
        .then(data => data.features)
      this.formattedUseOfForce = this.formatUseOfForce(rawUseOfForce)
    }

    // partially apply filters
    const before = (reports: Array<UseOfForce>) => filterBefore(query, reports)
    const after = (reports: Array<UseOfForce>) => filterAfter(query, reports)
    const exact = (reports: Array<UseOfForce>) => filterExactDate(query, reports)
    const disposition = (reports: Array<UseOfForce>) => filterOne('disposition', query, reports)
    const geo_beat = (reports: Array<UseOfForce>) => filterOne('geo_beat', query, reports)
    const officer_condition_injury = (reports: Array<UseOfForce>) => filterOne('officer_condition_injury', query, reports)
    const status = (reports: Array<UseOfForce>) => filterOne('status', query, reports)
    const subject_race = (reports: Array<UseOfForce>) => filterOne('subject_race', query, reports)
    const subject_sex = (reports: Array<UseOfForce>) => filterOne('subject_sex', query, reports)
    const subject_injury = (reports: Array<UseOfForce>) => filterOne('subject_injury', query, reports)
    const subject_resistence = (reports: Array<UseOfForce>) => filterOne('subject_resistence', query, reports)
    const type_force_used = (reports: Array<UseOfForce>) => filterOne('type_force_used', query, reports)

    // compose
    return applyFilters([
      before,
      after,
      exact,
      disposition,
      geo_beat,
      officer_condition_injury,
      status,
      subject_race,
      subject_sex,
      subject_injury,
      subject_resistence,
      type_force_used
    ], this.formattedUseOfForce)
  }

  private formatUseOfForce(reports: Array<UnformattedReport>): Array<UseOfForce> {
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
}
