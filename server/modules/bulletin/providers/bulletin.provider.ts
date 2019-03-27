import { Injectable, ProviderScope } from '@graphql-modules/di'
import { Connection, Like } from 'typeorm'

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

    return await query.getMany()
  }
}
