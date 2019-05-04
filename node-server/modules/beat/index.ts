import { GraphQLModule } from '@graphql-modules/core'
import { ProviderScope } from '@graphql-modules/di'
import { loadResolversFiles, loadSchemaFiles } from '@graphql-modules/sonar'

import { UtilsModule } from '../utils.module'
import { BeatProvider } from './providers/beat.provider'

export const BeatModule = new GraphQLModule({
  name: 'Beat',
  imports: [ UtilsModule ],
  providers: [ BeatProvider ],
  defaultProviderScope: ProviderScope.Session,
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/')
})

export { BeatProvider }
