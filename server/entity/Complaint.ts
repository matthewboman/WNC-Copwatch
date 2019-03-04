import { OpenDataReport } from './OpenDataReport'

enum Disposition {
  Exonerated,
  Nonsustained,
  Open,
  Sustained,
  Unfounded,
  Withdrawn,
}

enum Status {
  Completed,
  Open
}

export default interface Complaint extends OpenDataReport {
  incident_type: String
  disposition: Disposition
  status: Status
  allegation: String
  ia_no: String
}
