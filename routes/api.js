const express = require('express')
const fs = require('fs')
const MongoQS = require('mongo-querystring')
const router = express.Router()

const winston = require('../config/winston')
const BulletinController = require('../controllers/BulletinController')
const OpenDataController = require('../controllers/OpenDataController')

/*
 * Traffic Stops (from our database)
 */
router.get('/traffic_stops', (req, res) => {
  OpenDataController.traffic_stops()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

/*
 * daily APD bulletins
 * route works with or without query string
 */
router.get('/bulletin_reports', (req, res) => {
  if (Object.keys(req.query).length) {
    const qs = new MongoQS()
    BulletinController.byQueryString(qs.parse(req.query))
      .then(reports => res.status(200).send(reports) )
      .catch(err => {
        winston.error(err)
        res.status(500).send([])
      })
  } else {
    BulletinController.bulletin()
      .then(reports => res.status(200).send(reports))
      .catch(err => {
        winston.error(err)
        res.status(500).send([])
      })
  }
})

router.get('/bulletin_reports/description/:word', (req, res) => {
  BulletinController.bulletin_description(req.params.word)
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/bulletin_reports/officer/:officer', (req, res) => {
  BulletinController.bulletin_officer(req.params.officer)
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

/*
 * start && end dates are formatted `yyyymmdd`
 */
router.get('/bulletin_reports/range/:start/:end', (req, res) => {
  BulletinController.bulletin_dates(req.params.start, req.params.end)
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})


/*
 * @deprecated
 * open data from arcgis
 */
router.get('/open_data_reports', (req, res) => {
  OpenDataController.odr()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open_data_reports/searches', (req, res) => {
  OpenDataController.odr_searches()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open_data_reports/arrests', (req, res) => {
  OpenDataController.odr_arrests()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

module.exports = router
