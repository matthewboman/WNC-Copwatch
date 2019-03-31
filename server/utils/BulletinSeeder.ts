/**
 * Adds daily bulletins from remote URL to Postgres database.
 */

import axios from 'axios'
import { createConnection } from 'typeorm'

import { Bulletin, OriginalBulletin } from '../entity'
import { parseID, parseName } from './functions'

const URL = `https://copwatch.avlcommunityaction.com/api/v1/bulletin-reports/`

const getBulletins = async (): Promise<OriginalBulletin[]> => await axios
  .get(URL)
  .then(res => res.data)

createConnection().then(connection => {
  getBulletins().then((bulletins: OriginalBulletin[]) => {
    let counter = 1 // make up a # for reports

    bulletins.forEach((b: OriginalBulletin) => {
      const { lastName, firstInitial, middleInitial } = parseName(b.officer)

      // we can pull the ID from description for Traffic Control
      const id = b.description == 'TC'
        ? parseID(b)
        : counter

      const bulletin = new Bulletin({
        id,
        date: new Date(b.dateTime),
        key: b.code,
        force: b.force,
        description: b.description,
        address: b.address,
        geometry: b.latLng,
        lastName,
        firstInitial,
        middleInitial,
        race: b.race || '',
        sex: '' // we hadn't been tracking this
      })

      connection.manager.save(bulletin)
      counter++
    })
  })
})
.catch(err => console.log(err))
