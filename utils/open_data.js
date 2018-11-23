/*
 * Adds latitude and longitude to Traffic Stop reports and saves them to database.
 *
 * This was developed when Traffic Stop data stopped supplying latitude and
 * longitude in order to have data that persists.
 */

const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

// const winston = require('../config/winston')
const geoLocation = require('./geoLocation')
const traffic_stop = require('../models/traffic_stop')
const OpenDataController = require('../controllers/OpenDataController')

MongoClient.connect(process.env.DB_URL_LOCAL, (err, client) => {
  if (err) {
    console.error(`DB CONNECTION FAILED: ${err}`)
  }

  const db = client.db('police_reports')

  /*
  * This will need run whenever new data is imported.
  * Reports need broken into sizeable blocks so we don't reach Google's API limit.
  * Uncomment an `if` clause and run.
  */
  OpenDataController.odr()
    .then(reports => {
      const stops = reports.filter(report => {
        // // after june -- run locally 10/20/18
        // if (report.dateTime > new Date("2018-06-01T00:00:00.000Z")) {
        //   return report
        // }

        // // between june and january -- run locally 10/20/18
        // if (
        //   (report.dateTime > new Date("2018-01-01T00:00:00.000Z")) &&
        //   (report.dateTime < new Date("2018-06-01T00:00:00.000Z"))
        // ) {
        //   return report
        // }

        // // before january
        if (
          report.dateTime < new Date("2018-01-01T00:00:00.000Z")
        )
          return return report
        }
      })

      const promises = stops.map(async (report) => {
        const latLng = await geoLocation(report.address)
        return ({ ...report, latLng})
      })

      Promise.all(promises).then(reports => {
        console.log('formatted and returning', reports)
        db.collection('traffic_stops').insertMany(reports)
          .then(res => {
            console.log('SUCCESS', res)
            client.close()
          })
          .catch(err => {
            console.log('ERROR', err)
            client.close()
          })
      })
    })

})
