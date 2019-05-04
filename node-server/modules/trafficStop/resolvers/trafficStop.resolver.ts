import { Query } from '../../../entity'
import { TrafficStopProvider } from '../providers/trafficStop.provider'

export default {
  Query: {
    trafficStops: (_: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getTrafficStops(args)
    },
    trafficStop: (_: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getTrafficStop(args)
    },
    dailyTrafficStopStats: (_: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getDailyTrafficStopStats()
    },
    allTrafficStopStats: (_: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getAllTrafficStopStats()
    }
  }
}
