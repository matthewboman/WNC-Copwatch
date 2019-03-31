interface OpenDataReport {
  id: number | string
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
