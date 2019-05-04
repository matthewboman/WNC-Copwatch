import { Injectable } from '@graphql-modules/di'

import { HttpService } from '../../../services'
import {
  Bulletin,
  Query,
  UseOfForce,
  UnformattedReport
} from '../../../entity'
import {
  withinShape
} from '../../../utils/functions'
import {
  applyFilters,
  filterOne,
  filterBefore,
  filterAfter,
  filterExactDate,
} from '../../../utils/filters'
import { BeatProvider } from '../../beat/providers/beat.provider'
import { BulletinProvider } from '../../bulletin/providers/bulletin.provider'

@Injectable()
export class UseOfForceProvider {
  httpService: HttpService
  baseURL: string = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
  useOfForceURL: string = "APDUseOfForce/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  formattedUseOfForce: UseOfForce[]

  constructor(
    private beatProvider: BeatProvider,
    private bulletinProvider: BulletinProvider
  ) {
    this.httpService = new HttpService(this.baseURL)
  }

  async getAllUseOfForce(query: any): Promise<UseOfForce[]> {
    if (!this.formattedUseOfForce) {
      const rawUseOfForce: UnformattedReport[] = await this.httpService.get(this.useOfForceURL)
        .then(data => data.features)
      this.formattedUseOfForce = this.formatUseOfForce(rawUseOfForce)
    }

    // partially apply filters
    const before = (reports: UseOfForce[]) => filterBefore(query, reports)
    const after = (reports: UseOfForce[]) => filterAfter(query, reports)
    const exact = (reports: UseOfForce[]) => filterExactDate(query, reports)
    const disposition = (reports: UseOfForce[]) => filterOne('disposition', query, reports)
    const geo_beat = (reports: UseOfForce[]) => filterOne('geo_beat', query, reports)
    const officer_condition_injury = (reports: UseOfForce[]) => filterOne('officer_condition_injury', query, reports)
    const status = (reports: UseOfForce[]) => filterOne('status', query, reports)
    const subject_race = (reports: UseOfForce[]) => filterOne('subject_race', query, reports)
    const subject_sex = (reports: UseOfForce[]) => filterOne('subject_sex', query, reports)
    const subject_injury = (reports: UseOfForce[]) => filterOne('subject_injury', query, reports)
    const subject_resistence = (reports: UseOfForce[]) => filterOne('subject_resistence', query, reports)
    const type_force_used = (reports: UseOfForce[]) => filterOne('type_force_used', query, reports)

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

  async getUseOfForce(id: number): Promise<UseOfForce> {
    if (!this.formattedUseOfForce) {
      const rawUseOfForce: UnformattedReport[]= await this.httpService.get(this.useOfForceURL)
        .then(data => data.features)
      this.formattedUseOfForce = this.formatUseOfForce(rawUseOfForce)
    }
    // find matching ID
    const report = this.formattedUseOfForce.filter(r => r.id === id)[0]

    // get every bulletin from that day
    const bulletinsFromDay = await this.bulletinProvider.getAllBulletins({ exact: report.date })

    // find every bulletin within beat
    const beat = await this.beatProvider.rawBeatById(report.geo_beat)
    const possible_bulletins = bulletinsFromDay.filter((bulletin: Bulletin) => {
      if (!bulletin.geometry) return false

      const point = [ bulletin.geometry.lng as number, bulletin.geometry.lat as number ]
      return withinShape(point, beat.geometry.rings[0])
    })

    return {
      ...report,
      possible_bulletins
    }
  }

  private formatUseOfForce = (reports: UnformattedReport[]): UseOfForce[] =>
    reports.map((report: UnformattedReport) => {
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
        subject_injury: report.attributes.subject_injury,
      }
      return useOfForce
    })

}
