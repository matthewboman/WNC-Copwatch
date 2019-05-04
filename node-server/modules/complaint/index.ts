import { GraphQLModule } from '@graphql-modules/core'
import { ProviderScope } from '@graphql-modules/di'
import { loadResolversFiles, loadSchemaFiles } from '@graphql-modules/sonar'

import { UtilsModule } from '../utils.module'
import { ComplaintProvider } from './providers/complaint.provider'

export const ComplaintModule = new GraphQLModule({
  name: 'Complaints',
  imports: [ UtilsModule ],
  providers: [ ComplaintProvider ],
  defaultProviderScope: ProviderScope.Session,
  typeDefs: loadSchemaFiles(__dirname + '/schema/'),
  resolvers: loadResolversFiles(__dirname + '/resolvers')
})
