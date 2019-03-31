/**
 * Adds daily bulletins from `/reports` directory to Postgres database
 */

import 'dotenv/config'
import * as path from 'path'
import * as xlsx from 'node-xlsx'
import { createConnection } from 'typeorm'

import { Bulletin } from '../entity'
import { geoFromAddress } from '../services/GeoService'
import { parseName } from './functions'

const fileName = process.argv[2]
const filePath = path.join(__dirname, `../reports/${fileName}`)
const [ force, date ] = fileName.split('.') // ex. [ apd, 2019-4-1 ]

const sheets = xlsx.parse(filePath)
const [ header, ...reports ] = sheets[0].data
  .filter((r: any) => r[0] != 'TA' || r[0] != 'LW')

const format = async (report: any): Promise<Bulletin> => {
  const address = report[5].slice(4, )
  const {
    lastName,
    firstInitial,
    middleInitial
  } = parseName(report[8])

  const geometry = await geoFromAddress(address)

  const bulletin = new Bulletin ({
    id: report[1],
    date: new Date(date),
    key: report[0],
    force,
    description: report[4],
    address,
    geometry,
    lastName,
    firstInitial,
    middleInitial,
    race: report[11],
    sex: report[12]
  })
  return bulletin
}

const promises = reports.map(async (report) => format(report))

createConnection().then(connection => {
  Promise.all(promises).then(bulletins => {
    bulletins.forEach((bulletin: Bulletin) => {
      connection.manager.save(bulletin)
    })
  })
})
.catch(err => console.log(err))
