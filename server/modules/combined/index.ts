import { GraphQLModule } from '@graphql-modules/core'
import { ProviderScope } from '@graphql-modules/di'
import { loadResolversFiles, loadSchemaFiles } from '@graphql-modules/sonar'

import { BeatModule, BeatProvider } from '../beat'
import { BulletinModule, BulletinProvider } from '../bulletin'
import { DatabaseModule } from '../database'
import { UseOfForceModule, UseOfForceProvider } from '../useOfForce'
import { OfficerModule, OfficerProvider } from '../officer'

export const CombinedModule = new GraphQLModule({
  name: 'Combined',
  imports: [
    BeatModule,
    BulletinModule,
    DatabaseModule,
    OfficerModule,
    UseOfForceModule
  ],
  providers: [],
  defaultProviderScope: ProviderScope.Session,
  typeDefs: '',
  resolvers: {}
})
