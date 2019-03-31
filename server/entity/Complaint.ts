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

export interface Complaint extends OpenDataReport {
  incident_type: string
  disposition: Disposition
  status: Status
  allegation: string
  ia_no: string
}
