import { HttpService } from '../services'
import {
  Beat,
  UnformattedReport
} from '../entity'
import {
  flatten,
  tupleToObj
} from '../utils/functions'

const APD_OPEN_DATA_URL = "https://arcgis.ashevillenc.gov/arcgis/rest/services"
const apdOpenDataService = new HttpService(APD_OPEN_DATA_URL)

const formatBeats = (beats: Array<UnformattedReport>): Array<Beat> => {
  return beats.map((b: UnformattedReport) => {
    const beat: Beat = {
      id: b.attributes.objectid,
      beat: b.attributes.beat,
      outline: tupleToObj(flatten(b.geometry.rings))
    }
    return beat
  })
}

export default {
  Query: {
    beats: async (parent: any, args: any, context: any) => {
      const url: String = "Boundaries/LawBeats/MapServer//0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
      const rawBeats: Array<UnformattedReport> = await apdOpenDataService.get(url).then(data => data.features )
      const formattedBeats: Array<Beat> = formatBeats(rawBeats)

      return formattedBeats
    },
    
    beat: async (parent: any, args: any, context: any) => {
      const url: String = "Boundaries/LawBeats/MapServer//0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
      const rawBeats: Array<UnformattedReport> = await apdOpenDataService.get(url).then(data => data.features )
      const formattedBeats: Array<Beat> = formatBeats(rawBeats)

      return formattedBeats
        .filter((b: Beat) => b.beat.toLowerCase() === args.beat.toLowerCase())[0]
    }
  }
}
