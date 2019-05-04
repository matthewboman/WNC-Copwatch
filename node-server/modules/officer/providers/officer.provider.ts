import { Injectable } from '@graphql-modules/di'

import { HttpService } from '../../../services'
import {
  Bulletin,
  Officer,
  Query,
  UnformattedReport,
  UseOfForce
} from '../../../entity'
import { BeatProvider } from '../../beat/providers/beat.provider'
import { BulletinProvider } from '../../bulletin/providers/bulletin.provider'
import { UseOfForceProvider } from '../../useOfForce/providers/useOfForce.provider'
import {
  dateWithoutTime,
  parseName,
  withinShape
} from '../../../utils/functions'
import {
  applyFilters,
  filterById,
  filterByLastName,
  filterByFirstInitial,
  filterByMiddleInitial
} from '../../../utils/filters'

interface BulletinAndUOF {
  bulletin: Bulletin
  report: UseOfForce
}

@Injectable()
export class OfficerProvider {
  httpService: HttpService
  baseURL: string = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
  staffURL: string = "Financials/FeatureServer/10/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  officers: Officer[]
  matches: Officer[]

  constructor(
    private beatProvider: BeatProvider,
    private bulletinProvider: BulletinProvider,
    private useOfForceProvider: UseOfForceProvider,
  ) {
    this.httpService = new HttpService(this.baseURL)
  }

  async allOfficers(): Promise<Officer[]> {
    if (!this.officers) {
      const rawStaff: UnformattedReport[] = await this.httpService.get(this.staffURL)
        .then(data => data.features)
      this.officers = this.extractAndFormatOfficers(rawStaff)
    }
    return this.officers
  }


  async officer(args: any): Promise<Officer[]> {
    if (!this.officers) {
      const rawStaff: UnformattedReport[] = await this.httpService.get(this.staffURL)
        .then(data => data.features)
      this.officers = this.extractAndFormatOfficers(rawStaff)
    }

    const id = (officers: Officer[]) => filterById(args, officers)
    const last = (officers: Officer[]) => filterByLastName(args, officers)
    const first = (officers: Officer[]) => filterByFirstInitial(args, officers)
    const middle = (officers: Officer[]) => filterByMiddleInitial(args, officers)

    const matches = applyFilters([
      id,
      last,
      first,
      middle
    ], this.officers)

    // get bulletins for each officer
    const bulletinQuery = this.bulletinProvider.createQueryBuilder()
    const { lastName, firstInitial, middleInitial } = args

    if (lastName) {
      bulletinQuery.andWhere('bulletin.lastName = :lastName', { lastName })
    }
    if (firstInitial) {
      bulletinQuery.andWhere('bulletin.firstInitial = :firstInitial', { firstInitial })
    }
    if (middleInitial) {
      bulletinQuery.andWhere('bulletin.middleInitial = :middleInitial', { middleInitial })
    }

    const bulletins = await bulletinQuery.getMany()

    // match bulletins to Use of Force data
    const useOfForceReports = await this.useOfForceProvider.getAllUseOfForce({})
    const { sameDay, beatsToSearch } = this.findSameDay(bulletins, useOfForceReports)

    // get only necessary beats
    const promises = beatsToSearch.map(async (beat) =>
      await this.beatProvider.rawBeatById(beat)
    )
    const beats = await Promise.all(promises)

    // see if geometry of bulletin is within beat
    const possibleUseOfForce = sameDay
      .filter((combined: BulletinAndUOF) => {
        let withinBeat = false
        const { bulletin } = combined
        const point = bulletin.geometry
          ? [ bulletin.geometry.lng as number, bulletin.geometry.lat as number ]
          : null
        if (!point) return false // initial geometry lookup may have failed

        beats.forEach(beat => {
          const shape = beat.geometry.rings[0]
          if (withinShape(point, shape)) {
            withinBeat = true
          }
        })

        return withinBeat
      })
      .map((combined: BulletinAndUOF) => combined.report)

    return matches.map(match => ({
      ...match,
      bulletins,
      possibleUseOfForce
    }))
  }

  async officerByName(lastName: string): Promise<Officer[]> {
    if (!this.officers) {
      const rawStaff: UnformattedReport[] = await this.httpService.get(this.staffURL)
        .then(data => data.features)
      this.officers = this.extractAndFormatOfficers(rawStaff)
    }
    return this.officers.filter((officer: Officer) => officer.lastName === lastName.toLowerCase())
  }

  async officerById(id: number): Promise<Officer[]> {
    if (!this.officers) {
      const rawStaff: UnformattedReport[] = await this.httpService.get(this.staffURL)
        .then(data => data.features)
      this.officers = this.extractAndFormatOfficers(rawStaff)
    }
    return this.officers.filter((officer: Officer) => officer.id === id)
  }

  private extractAndFormatOfficers(staff: UnformattedReport[]): Officer[] {
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

  private findSameDay(bulletins: Bulletin[], useOfForceReports: UseOfForce[]) {
    let sameDay: BulletinAndUOF[] = []
    let beatsToSearch: string[] = []
    bulletins.forEach(bulletin => {
      useOfForceReports.forEach(report => {
        if (dateWithoutTime(report.date).getTime() == dateWithoutTime(bulletin.date).getTime()) {
          sameDay.push({ bulletin, report })

          if (!beatsToSearch.includes(report.geo_beat)) {
            beatsToSearch.push(report.geo_beat)
          }
        }
      })
    })
    return { sameDay, beatsToSearch }
  }
}
