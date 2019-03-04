import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    beats: [Beat]
    beat(beat: String): Beat
  }

  type Beat {
    id: Int
    beat: String
    outline: [LatLng]
  }
`
