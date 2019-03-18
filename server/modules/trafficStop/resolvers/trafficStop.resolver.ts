import { GraphQLModule, ModuleContext } from '@graphql-modules/core'

import { Query } from '../../../entity'
import { IResolvers } from '../../../types'
import { TrafficStopProvider } from '../providers/trafficStop.provider'

export default {
  Query: {
    trafficStops: (obj: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getTrafficStops(args)
    },
    dailyTrafficStopStats: (obj: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getDailyTrafficStopStats()
    },
    allTrafficStopStats: (obj: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getAllTrafficStopStats()
    }
  }
} 
