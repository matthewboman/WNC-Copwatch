/*
 * Parses .xls || .xlsx files from daily police bulletin
 * script: `npm run parser force_name.YYYY-MM-DD.xls`
 *
 * https://apdp2c.buncombecounty.org/dailybulletin.aspx
 * https://bcsdp2c.buncombecounty.org/dailybulletin.aspx
 */

const fs = require('fs')
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const xlsx = require('node-xlsx')
require('dotenv').config()

const winston = require('../config/winston')
const fns = require('./functions')
const GeoService = require('../services/GeoService')
const report = ('../models/report')
const fileName = process.argv[2]
const filePath = path.join(__dirname, `../reports/${fileName}`)
const [force, date, type] = fileName.split('.') //=> [apd, 2018-10-10, xls]

MongoClient.connect(process.env.DB_URL, (err, client) => {
  if (err) {
    winston.error(`DB CONNECTION FAILED: ${err}`)
  }
  const db = client.db('police_reports')

  const workSheetsFromFile = xlsx.parse(filePath)
  const [header, ...reports] = workSheetsFromFile[0].data
    .filter(e => e[0] != 'TA') // don't store traffic accidents
    .filter(e => e[0] != 'LW') // don't store incidents
    .map(e => ({
      'repord_id': e[1],
      'force': force.toLowerCase(),
      'code': e[0],
      'description': e[4],
      'address': e[5].slice(4, e[5].length),
      'dateTime': fns.dateFromFilename(date),
      'race': e[11],
      'officer': e[8],
    }))

    const promises = reports.map(async (report) => {
      const latLng = await GeoService(report.address)
      return ({ ...report, latLng })
    })

    Promise.all(promises).then(reports => {
      db.collection('reports').insertMany(reports)
        .then(res => client.close())
        .catch(err => {
          winston.error(err)
          client.close()
        })
    })
})
