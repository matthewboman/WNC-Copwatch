import { GraphQLModule } from '@graphql-modules/core'
import { ProviderScope } from '@graphql-modules/di'
import { loadResolversFiles, loadSchemaFiles } from '@graphql-modules/sonar'

import { BeatModule, BeatProvider } from '../beat'
import { BulletinModule, BulletinProvider } from '../bulletin'
import { UtilsModule } from '../utils.module'
import { UseOfForceProvider } from './providers/useOfForce.provider'

export const UseOfForceModule: any = new GraphQLModule({
  name: 'UseOfForce',
  imports: [
    BeatModule,
    BulletinModule,
    UtilsModule
  ],
  providers: [
    BeatProvider,
    BulletinProvider,
    UseOfForceProvider,
  ],
  defaultProviderScope: ProviderScope.Session,
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/')
})

export { UseOfForceProvider }
