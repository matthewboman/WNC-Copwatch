/**
 * Potential types for officer if stored in DB
 *
 * pros: relations to reports
 * cons: can't keep it updated
 */

import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

import Bulletin from './Bulletin'

interface OfficerConstructor {
  firstName: string
  firstInitial: string
  middleInitial?: string | null
  lastName: string
  position?: string | null
}

@Entity()
export class Officer {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: false })
  firstName: string

  @Column({ nullable: false })
  firstInitial: string

  @Column({ nullable: true })
  middleInitial: string

  @Column({ nullable: false })
  lastName: string

  @Column({ nullable: true })
  position: string

  // @OneToMany(type => Bulletin, bulletin => bulletin.officer, {
  //   cascade: ['insert', 'update'],
  //   eager: true
  // })
  // bulletins: Bulletin[]

  // constructor({
  //   firstName,
  //   firstInitial,
  //   middleInitial,
  //   lastName,
  //   position,
  // } : OfficerConstructor) {
  //   if (firstName) {
  //     this.firstName = firstName
  //   }
  //   if (firstInitial) {
  //     this.firstInitial = firstInitial
  //   }
  //   if (middleInitial) {
  //     this.middleInitial = middleInitial
  //   }
  //   if (lastName) {
  //     this.lastName = lastName
  //   }
  //   if (position) {
  //     this.position = position
  //   }
  // }
}
