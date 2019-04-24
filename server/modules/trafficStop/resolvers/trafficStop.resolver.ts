import { Query } from '../../../entity'
import { TrafficStopProvider } from '../providers/trafficStop.provider'

export default {
  Query: {
    trafficStops: (obj: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getTrafficStops(args)
    },
    trafficStop: (obj: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getTrafficStop(args)
    },
    dailyTrafficStopStats: (obj: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getDailyTrafficStopStats()
    },
    allTrafficStopStats: (obj: any, args: Query, { injector }: any) => {
      return injector.get(TrafficStopProvider).getAllTrafficStopStats()
    }
  }
}
