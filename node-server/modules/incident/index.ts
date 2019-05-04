import { GraphQLModule } from '@graphql-modules/core'
import { ProviderScope } from '@graphql-modules/di'
import { loadResolversFiles, loadSchemaFiles } from '@graphql-modules/sonar'

import { UtilsModule } from '../utils.module'
import { IncidentProvider } from './providers/incident.provider'

export const IncidentModule = new GraphQLModule({
  name: 'Incident',
  imports: [ UtilsModule ],
  providers: [ IncidentProvider ],
  defaultProviderScope: ProviderScope.Session,
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/')
})
