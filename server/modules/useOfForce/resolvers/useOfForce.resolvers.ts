import { GraphQLModule, ModuleContext } from '@graphql-modules/core'

import { Query } from '../../../entity'
import { IResolvers } from '../../../types'
import { UseOfForceProvider } from '../providers/useOfForce.provider'

export default {
  Query: {
    useOfForce: (obj: any, args: Query, { injector }: any) => {
      return injector.get(UseOfForceProvider).getAllUseOfForce(args)
    }
  }
}
