import { Query } from '../../../entity'
import { UseOfForceProvider } from '../providers/useOfForce.provider'

export default {
  Query: {
    useOfForceIncidents: (_: any, args: Query, { injector }: any) => {
      return injector.get(UseOfForceProvider).getAllUseOfForce(args)
    },
    useOfForceIncident: (_: any, args: Query, { injector }: any) => {
      return injector.get(UseOfForceProvider).getUseOfForce(args.id)
    }
  }
}
