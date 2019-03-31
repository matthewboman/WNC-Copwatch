import { Injectable } from '@graphql-modules/di'

import { HttpService } from '../../../services'
import {
  Beat,
  UnformattedReport
} from '../../../entity'
import {
  flatten,
  tupleToObj
} from '../../../utils/functions'

@Injectable()
export class BeatProvider {
  httpService: HttpService
  baseURL: string = "https://arcgis.ashevillenc.gov/arcgis/rest/services"
  beatURL: string = "Boundaries/LawBeats/MapServer//0/query?where=1%3D1&outFields=*&outSR=4326&f=json"
  beats: Beat[]
  unformattedBeats: Array<any>

  constructor() {
    this.httpService = new HttpService(this.baseURL)
  }

  async allBeats(): Promise<Beat[]> {
    if (!this.beats) {
      const rawBeats: Array<UnformattedReport> = await this.httpService.get(this.beatURL)
        .then(data => data.features)
      this.beats = this.formatBeats(rawBeats)
    }
    return this.beats
  }

  async rawBeats(): Promise<Beat[]> {
    if (!this.unformattedBeats) {
      this.unformattedBeats = await this.httpService.get(this.beatURL)
        .then(data => data.features)
    }
    return this.unformattedBeats
  }

  async beatById(id: string): Promise<Beat> {
    if (!this.beats) {
      const rawBeats: Array<UnformattedReport> = await this.httpService.get(this.beatURL)
        .then(data => data.features)
      this.beats = this.formatBeats(rawBeats)
    }
    return this.beats
      .filter((b: Beat) => b.beat.toLowerCase() === id.toLowerCase())[0]
  }

  async rawBeatById(id: string): Promise<any> {
    if (!this.unformattedBeats) {
      this.unformattedBeats = await this.httpService.get(this.beatURL)
        .then(data => data.features)
    }

    return this.unformattedBeats
      .filter((b: any) => b.attributes.beat.toLowerCase() === id.toLowerCase())[0]
  }

  private formatBeats(beats: Array<UnformattedReport>): Beat[] {
    return beats.map((b: UnformattedReport) => {
      const beat: Beat = {
        id: b.attributes.objectid,
        beat: b.attributes.beat,
        outline: tupleToObj(flatten(b.geometry.rings))
      }
      return beat
    })
  }
}
