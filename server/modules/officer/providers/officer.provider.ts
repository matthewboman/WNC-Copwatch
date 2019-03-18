import { Injectable } from '@graphql-modules/di'

import { HttpService } from '../../../services'
import {
  Officer,
  UnformattedReport
} from '../../../entity'
import {
  parseName
} from '../../../utils/functions'

@Injectable()
export class OfficerProvider {
  httpService: HttpService
  baseURL: string = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
  staffURL: string = "Financials/FeatureServer/10/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  officers: Array<Officer>

  constructor() {
    this.httpService = new HttpService(this.baseURL)
  }

  async allOfficers(): Promise<Array<Officer>> {
    if (!this.officers) {
      const rawStaff: Array<UnformattedReport> = await this.httpService.get(this.staffURL)
        .then(data => data.features)
      this.officers = this.extractAndFormatOfficers(rawStaff)
    }
    return this.officers
  }

  async officerByName(lastName: string): Promise<Array<Officer>> {
    if (!this.officers) {
      const rawStaff: Array<UnformattedReport> = await this.httpService.get(this.staffURL)
        .then(data => data.features)
      this.officers = this.extractAndFormatOfficers(rawStaff)
    }
    return this.officers.filter((officer: Officer) => officer.lastName === lastName.toLowerCase())
  }

  async officerById(id: number): Promise<Array<Officer>> {
    if (!this.officers) {
      const rawStaff: Array<UnformattedReport> = await this.httpService.get(this.staffURL)
        .then(data => data.features)
      this.officers = this.extractAndFormatOfficers(rawStaff)
    }
    return this.officers.filter((officer: Officer) => officer.id === id)
  }

  private extractAndFormatOfficers(staff: Array<UnformattedReport>): Array<any> {
    return staff.filter((s: UnformattedReport) => s.attributes.department === 'POLICE')
      .map((o: UnformattedReport) => {
        const { firstName, firstInitial, middleInitial, lastName } = parseName(o.attributes.employee_name)
        const officer: Officer = {
          id: o.attributes.OBJECTID,
          date: new Date(o.attributes.hire_date),
          firstName,
          firstInitial,
          middleInitial,
          lastName,
          position: o.attributes.position_,
          division: o.attributes.division,
        }
        return officer
      })
  }
}
