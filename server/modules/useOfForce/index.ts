import { GraphQLModule } from '@graphql-modules/core'
import { ProviderScope } from '@graphql-modules/di'
import { loadResolversFiles, loadSchemaFiles } from '@graphql-modules/sonar'

import { UtilsModule } from '../utils.module'
import { UseOfForceProvider } from './providers/useOfForce.provider'

export const UseOfForceModule = new GraphQLModule({
  name: 'UseOfForce',
  imports: [ UtilsModule ],
  providers: [ UseOfForceProvider ],
  defaultProviderScope: ProviderScope.Session,
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/')
})
