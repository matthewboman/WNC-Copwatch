import { GraphQLModule, ModuleContext } from '@graphql-modules/core'

import { Query } from '../../../entity'
import { IResolvers } from '../../../types'
import { OfficerProvider } from '../providers/officer.provider'

export default {
  Query: {
    officers: (obj: any, args: Query, { injector }: any) => {
      return injector.get(OfficerProvider).allOfficers()
    },
    officer: (obj: any, args: Query, { injector }: any) => {
      return injector.get(OfficerProvider).officer(args)
    }
  }
}
