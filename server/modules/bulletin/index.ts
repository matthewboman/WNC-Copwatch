import { GraphQLModule } from '@graphql-modules/core'
import { InjectFunction, ProviderScope } from '@graphql-modules/di'
import { loadResolversFiles, loadSchemaFiles } from '@graphql-modules/sonar'

import { DatabaseModule } from '../database'
import { UtilsModule } from '../utils.module'
import { BulletinProvider } from './providers/bulletin.provider'

export const BulletinModule = new GraphQLModule({
  name: 'Bulletin',
  imports: [
    DatabaseModule,
    UtilsModule
  ],
  providers: [ BulletinProvider ],
  defaultProviderScope: ProviderScope.Session,
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/')
})

export { BulletinProvider }
