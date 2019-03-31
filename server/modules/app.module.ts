import { GraphQLModule } from '@graphql-modules/core'
import { Connection } from 'typeorm'

import { BeatModule } from './beat'
import { BulletinModule } from './bulletin'
import { DatabaseModule } from './database'
import { ComplaintModule } from './complaint'
import { IncidentModule } from './incident'
import { OfficerModule } from './officer'
import { TrafficStopModule } from './trafficStop'
import { UseOfForceModule } from './useOfForce'

export interface IAppModuleConfig {
  connection: Connection
}

export const AppModule = new GraphQLModule<IAppModuleConfig>({
  name: 'App',
  imports: ({ config: { connection } }) => [
    BeatModule,
    BulletinModule,
    DatabaseModule.forRoot({ connection }),
    ComplaintModule,
    IncidentModule,
    OfficerModule,
    TrafficStopModule,
    UseOfForceModule,
  ],
  configRequired: true
})
