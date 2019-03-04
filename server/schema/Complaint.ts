import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    complaints(
      after: String,
      before: String,
      allegation: String,
      disposition: String,
      status: String
    ): [Complaint!]!
  }

  type Complaint {
    id: Int
    date: Date

    incident_type: String
    disposition: String
    status: String
    allegation: String
    ia_no: String
  }
`
