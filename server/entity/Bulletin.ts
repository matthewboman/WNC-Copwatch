import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne
} from 'typeorm'

// import Officer from './Officer'
import LatLng from './LatLng'

interface BulletinConstructor {
  id: Number
  date: Date
  key: string
  description: string
  geometry: LatLng
  // officer?: Officer
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
  description: String

  @Column("json")
  geometry: LatLng

  // @ManyToOne(type => Officer, officer => officer.bulletins, {
  //   cascade: ['insert', 'update'],
  //   eager: false
  // })
  // officer?: Officer | null

  @Column()
  race: String

  @Column()
  sex: String

  // constructor({
  //   id,
  //   date,
  //   key,
  //   description,
  //   geometry,
  //   officer,
  //   race,
  //   sex,
  // }: BulletinConstructor) {
  //   if (id) {
  //     this.id = id
  //   }
  //   if (date) {
  //     this.date = date
  //   }
  //   if (key) {
  //     this.key = key
  //   }
  //   if (description) {
  //     this.description = description
  //   }
  //   if (geometry) {
  //     this.geometry = geometry
  //   }
  //   if (officer) {
  //     this.officer = officer
  //   }
  //   if (race) {
  //     this.race = race
  //   }
  //   if (sex) {
  //     this.sex = sex
  //   }
  // }
}

export default Bulletin
