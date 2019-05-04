import { Beat } from './Beat'
import { Bulletin, ExtendedBulletin, OriginalBulletin } from './Bulletin'
import { Complaint } from './Complaint'
import { Incident } from './Incident'
import { LatLng } from './LatLng'
import { Officer, Name } from './Officer'
import { OpenDataReport, UnformattedReport } from './OpenDataReport'
import { Query } from './Query'
import { AllTrafficStopStats, DailyTrafficStats, TrafficStop } from './TrafficStop'
import { UseOfForce } from './UseOfForce'

interface Stat {
  key: string
  value: number
}

export {
  AllTrafficStopStats,
  Beat,
  Bulletin,
  Complaint,
  DailyTrafficStats,
  ExtendedBulletin,
  Incident,
  LatLng,
  Officer,
  OpenDataReport,
  OriginalBulletin,
  Name,
  Query,
  Stat,
  TrafficStop,
  UnformattedReport,
  UseOfForce
}
