import { Query } from '../../../entity'
import { IncidentProvider } from '../providers/incident.provider'

export default {
  Query: {
    incidents: (obj: any, args: Query, { injector }: any) => {
      return injector.get(IncidentProvider).getAllIncidents(args)
    }
  }
}
