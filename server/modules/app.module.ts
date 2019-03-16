import { GraphQLModule } from '@graphql-modules/core'
import { Connection } from 'typeorm'
import { Express } from 'express'

import { BeatModule } from './beat'
import { ComplaintModule } from './complaint'
import { IncidentModule } from './incident'
import { TrafficStopModule } from './trafficStop'
import { UseOfForceModule } from './useOfForce'

export interface IAppModuleConfig {
  connection: Connection
}

export const AppModule = new GraphQLModule<IAppModuleConfig>({
  name: 'App',
  imports: ({ config: { connection } }) => [
    BeatModule,
    ComplaintModule,
    IncidentModule,
    TrafficStopModule,
    UseOfForceModule,
  ],
  configRequired: true
})
