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

  @Column()
  key: String

  @Column()
  force: String

  @Column()
  description: String

  @Column()
  address: String

  @Column("json")
  geometry: LatLng

  @Column()
  lastName?: String

  @Column()
  firstInitial?: String

  @Column()
  middleInitial?: String

  @Column()
  race: String

  @Column()
  sex: String

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

export default Bulletin
