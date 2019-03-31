import { Query } from '../../../entity'
import { UseOfForceProvider } from '../providers/useOfForce.provider'

export default {
  Query: {
    useOfForceIncidents: (obj: any, args: Query, { injector }: any) => {
      return injector.get(UseOfForceProvider).getAllUseOfForce(args)
    },
    useOfForceIncident: (obj: any, args: Query, { injector }: any) => {
      return injector.get(UseOfForceProvider).getUseOfForce(args.id)
    }
  }
}
