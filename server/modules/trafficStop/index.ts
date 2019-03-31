import { GraphQLModule } from '@graphql-modules/core'
import { ProviderScope } from '@graphql-modules/di'
import { loadResolversFiles, loadSchemaFiles } from '@graphql-modules/sonar'

import { UtilsModule } from '../utils.module'
import { TrafficStopProvider } from './providers/trafficStop.provider'

export const TrafficStopModule = new GraphQLModule({
  name: 'TrafficStop',
  imports: [ UtilsModule ],
  providers: [ TrafficStopProvider ],
  defaultProviderScope: ProviderScope.Session,
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/')
})
