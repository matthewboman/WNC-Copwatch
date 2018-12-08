const express = require('express')
const fs = require('fs')
const MongoQS = require('mongo-querystring')
const router = express.Router()

const winston = require('../config/winston')
const BulletinController = require('../controllers/BulletinController')
const OpenDataController = require('../controllers/OpenDataController')

/*
 * Daily APD bulletins
 */
router.get('/bulletin_reports', (req, res) => {
  // route works with or without query string
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

// start && end dates are formatted `yyyymmdd`
router.get('/bulletin_reports/range/:start/:end', (req, res) => {
  BulletinController.bulletin_dates(req.params.start, req.params.end)
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})


/*
 * Open Data -- Traffic stops
 */
router.get('/open_data/traffic_stops', (req, res) => {
  OpenDataController.traffic_stops()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open_data/traffic_stops/searches', (req, res) => {
  OpenDataController.ts_searches()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open_data/traffic_stops/arrests', (req, res) => {
  OpenDataController.ts_arrests()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open_data/traffic_stops/use-of-force', (req, res) => {
  OpenDataController.ts_use_of_force()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open_data/traffic_stops/daily-breakdown', (req, res) => {
  OpenDataController.ts_daily()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open-data/traffic_stops/statistics', (req, res) => {
  OpenDataController.ts_stats()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})


/*
 * Open Data -- Traffic stops (backups from our DB)
 */
router.get('/open_data_backups/traffic_stops', (req, res) => {
  OpenDataController.db_traffic_stops()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

module.exports = router
