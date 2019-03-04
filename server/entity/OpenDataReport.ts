interface OpenDataReport {
  id: Number | String
  date: Date
}

interface UnformattedReport {
  attributes: any
  geometry?: any
}

export {
  OpenDataReport,
  UnformattedReport
}
