import { ModuleContext } from '@graphql-modules/core'

import { Query } from '../../../entity'
import { IResolvers } from '../../../types'
import { BulletinProvider } from '../providers/bulletin.provider'

export default {
  Query: {
    apd_bulletins: (_: any, args: Query, { injector }: any) => {
      return injector.get(BulletinProvider).getAllBulletins(args)
    }
  }
}
