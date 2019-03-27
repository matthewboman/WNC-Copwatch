import { GraphQLModule } from '@graphql-modules/core'
import { ProviderScope } from '@graphql-modules/di'
import { loadResolversFiles, loadSchemaFiles } from '@graphql-modules/sonar'

import { BulletinModule, BulletinProvider } from '../bulletin'
import { DatabaseModule } from '../database'
import { UseOfForceModule, UseOfForceProvider } from '../useOfForce'
import { OfficerProvider } from './providers/officer.provider'

export const OfficerModule = new GraphQLModule({
  name: 'Officer',
  imports: [
    BulletinModule,
    DatabaseModule,
    UseOfForceModule
  ],
  providers: [
    BulletinProvider,
    OfficerProvider,
    UseOfForceProvider 
  ],
  defaultProviderScope: ProviderScope.Session,
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers/')
})
