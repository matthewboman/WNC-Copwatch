import { GraphQLDateTime } from 'graphql-iso-date'

import beatResolvers from './Beat'
import complaintResolvers from './Complaint'
import incidentResolvers from './Incident'
import trafficStopResolvers from './TrafficStop'
import useOfForceResolvers from './UseOfForce'

const customScalarResolver: {} = {
  Date: GraphQLDateTime
}

export default [
  customScalarResolver,

  beatResolvers,
  complaintResolvers,
  incidentResolvers,
  trafficStopResolvers,
  useOfForceResolvers
]
