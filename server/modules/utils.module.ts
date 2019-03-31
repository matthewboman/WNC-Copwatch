import { GraphQLModule } from '@graphql-modules/core'
import { GraphQLDateTime } from 'graphql-iso-date'

export const UtilsModule = new GraphQLModule({
  name: 'Utils',
  typeDefs: `
    scalar Date

    type LatLng {
      lat: Float
      lng: Float
    }
  `,
  resolvers: {
    Date: GraphQLDateTime
  }
})
