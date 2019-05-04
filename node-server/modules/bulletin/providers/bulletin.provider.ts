import { Injectable } from '@graphql-modules/di'
import { Connection } from 'typeorm'

import { DatabaseProvider } from '../../database/providers/database.provider'

import {
  Bulletin,
  Query
} from '../../../entity'

@Injectable()
export class BulletinProvider {
  constructor(
    private connection: Connection,
    private databaseProvider: DatabaseProvider
  ) {}

  createQueryBuilder() {
    return this.connection.createQueryBuilder(Bulletin, 'bulletin')
  }

  async getAllBulletins(args: Query) {
    const {
      before,
      after,
      exact,
      description,
      lastName,
      firstInitial,
      middleInitial
    } = args

    const query = this.createQueryBuilder()

    // build query based on arguments
    if (lastName) {
      query.andWhere('bulletin.lastName = :lastName', { lastName })
    }
    if (firstInitial) {
      query.andWhere('bulletin.firstInitial = :firstInitial', { firstInitial })
    }
    if (middleInitial) {
      query.andWhere('bulletin.middleInitial = :firstInitial', { middleInitial })
    }
    if (description) {
      query.andWhere('LOWER(description) LIKE :description', { description: `%${description.toLowerCase()}%`})
    }
    if (before) {
      query.andWhere('bulletin.date <= :before', { before })
    }
    if (after) {
      query.andWhere('bulletin.date >= :after', { after })
    }
    if (exact) {
      query.andWhere('bulletin.date = :exact', { exact })
    }

    return await query.getMany()
  }

  async getTargettedBulletins({ target }: Query) {
    const query = this.createQueryBuilder()

    switch (target) {
      case 'houseless':
        query.where(`
          LOWER(description) LIKE :trespass OR
          LOWER(description) LIKE :alcohol
        `, {
            trespass: `%second degree trespass%`,
            alcohol: `%open container alcohol%`
          }
        )
        return await query.getMany()

      default:
        return [{}]
    }
  }

  async getBulletinsByID({ id }: Query) {
    const query = await this.createQueryBuilder()
      .where('id = :id', { id })
      .getOne()

    return query
  }
}
