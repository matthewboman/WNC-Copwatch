import { gql } from 'apollo-server-express'

import beatSchema from './Beat'
import complaintSchema from './Complaint'
import incidentSchema from './Incident'
import latLngSchema from './LatLng'
import trafficStopSchema from './TrafficStop'
import useOfForceSchema from './UseOfForce'

const schema = gql`
  scalar Date

  type Query {
    _: Boolean
  }
`

export default [
  schema,

  beatSchema,
  complaintSchema,
  incidentSchema,
  latLngSchema,
  trafficStopSchema,
  useOfForceSchema
]
