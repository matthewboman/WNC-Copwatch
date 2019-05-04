import { GraphQLModule } from '@graphql-modules/core'
import { Connection } from 'typeorm'

import { DatabaseProvider } from './providers/database.provider'

export const DatabaseModule = new GraphQLModule({
  name: 'Auth',
  providers: ({ config: { connection } }) => [
    { provide: Connection, useValue: connection},
    DatabaseProvider
  ],
  configRequired: true
})
