import { gql } from 'apollo-server-express'

export default gql`
  type LatLng {
    lat: Float
    lng: Float
  }
`
