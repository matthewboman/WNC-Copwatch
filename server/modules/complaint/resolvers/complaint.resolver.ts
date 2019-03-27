import { GraphQLModule, ModuleContext } from '@graphql-modules/core'

import { Query } from '../../../entity'
import { IResolvers } from '../../../types'
import { ComplaintProvider } from '../providers/complaint.provider'

export default {
  Query: {
    complaints: (obj: any, args: Query, { injector }: any) => {
      return injector.get(ComplaintProvider).getAllComplaints(args)
    }
  }
}