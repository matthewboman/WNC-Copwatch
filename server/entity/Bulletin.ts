import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne
} from 'typeorm'

import LatLng from './LatLng'

interface BulletinConstructor {
  id?: Number
  date?: Date
  key?: string
  force?: string
  description?: string
  address?: string
  geometry?: LatLng
  lastName?: string
  firstInitial?: string
  middleInitial?: string
  race?: string | null
  sex?: string | null
}

@Entity()
export class Bulletin {
  @PrimaryColumn()
  id: Number

  @Column()
  date: Date

  @Column({ nullable: true })
  key?: String

  @Column({ nullable: true })
  force?: String

  @Column({ nullable: true })
  description?: String

  @Column({ nullable: true })
  address?: String

  @Column("json", { nullable: true })
  geometry?: LatLng

  @Column({ nullable: true })
  lastName?: String

  @Column({ nullable: true })
  firstInitial?: String

  @Column({ nullable: true })
  middleInitial?: String

  @Column({ nullable: true })
  race?: String

  @Column({ nullable: true })
  sex?: String

  constructor({
    id,
    date,
    key,
    force,
    description,
    address,
    geometry,
    lastName,
    firstInitial,
    middleInitial,
    race,
    sex,
  }: BulletinConstructor = {}) {
    if (id) {
      this.id = id
    }
    if (date) {
      this.date = date
    }
    if (key) {
      this.key = key
    }
    if (force) {
      this.force = force
    }
    if (address) {
      this.address = address
    }
    if (description) {
      this.description = description
    }
    if (geometry) {
      this.geometry = geometry
    }
    if (lastName) {
      this.lastName = lastName
    }
    if (firstInitial) {
      this.firstInitial = firstInitial
    }
    if (middleInitial) {
      this.middleInitial = middleInitial
    }
    if (race) {
      this.race = race
    }
    if (sex) {
      this.sex = sex
    }
  }
}

export interface OriginalBulletin {
  report_id: string
  force: string
  code: string
  description: string
  address: string
  race: string
  sex?: string | null
  officer: string
  _id: string
  dateTime: string
  latLng: LatLng
}

export interface ExtendedBulletin extends Bulletin {
  geo_beat: string
}

export default Bulletin
