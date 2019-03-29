import { Injectable } from '@graphql-modules/di'
import { Connection } from 'typeorm'

import { HttpService } from '../../../services'
import {
  Bulletin,
  ExtendedBulletin,
  Officer,
  UnformattedReport,
  UseOfForce
} from '../../../entity'
import { DatabaseProvider } from '../../database/providers/database.provider'
import { BeatProvider } from '../../beat/providers/beat.provider'
import { BulletinProvider } from '../../bulletin/providers/bulletin.provider'
import { UseOfForceProvider } from '../../useOfForce/providers/useOfForce.provider'
import {
  applyFilters,
  dateWithoutTime,
  parseName,
  withinShape
} from '../../../utils/functions'

const filterById = (args: any, officers: Array<Officer>) => args.id
  ? officers.filter((officer: Officer) => officer.id === args.id)
  : officers

const filterByLastName = (args: any, officers: Array<Officer>) => args.lastName
  ? officers.filter((officer: Officer) => officer.lastName === args.lastName.toLowerCase())
  : officers

const filterByFirstInitial = (args: any, officers: Array<Officer>) => args.firstInitial
  ? officers.filter((officer: Officer) => officer.firstInitial === args.firstInitial.toLowerCase())
  : officers

const filterByMiddleInitial = (args: any, officers: Array<Officer>) => args.middleInitial
  ? officers.filter((officer: Officer) => officer.middleInitial === args.middleInitial.toLowerCase())
  : officers

interface BulletinAndUOF {
  bulletin: Bulletin
  report: UseOfForce
}

const findSameDay = (bulletins: Bulletin[], useOfForceReports: UseOfForce[]) => {
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

@Injectable()
export class OfficerProvider {
  httpService: HttpService
  baseURL: string = "https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services"
  staffURL: string = "Financials/FeatureServer/10/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  officers: Array<Officer>
  matches: Array<Officer>

  constructor(
    private connection: Connection,
    private beatProvider: BeatProvider,
    private bulletinProvider: BulletinProvider,
    private useOfForceProvider: UseOfForceProvider,
    private databaseProvider: DatabaseProvider,
  ) {
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


  async officer(args: any): Promise<Array<Officer>> {
    if (!this.officers) {
      const rawStaff: Array<UnformattedReport> = await this.httpService.get(this.staffURL)
        .then(data => data.features)
      this.officers = this.extractAndFormatOfficers(rawStaff)
    }

    const id = (officers: Array<Officer>) => filterById(args, officers)
    const last = (officers: Array<Officer>) => filterByLastName(args, officers)
    const first = (officers: Array<Officer>) => filterByFirstInitial(args, officers)
    const middle = (officers: Array<Officer>) => filterByMiddleInitial(args, officers)

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
    const { sameDay, beatsToSearch } = findSameDay(bulletins, useOfForceReports)

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
          ? [ bulletin.geometry.lng, bulletin.geometry.lat ]
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
