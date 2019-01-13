const express = require('express')
const fs = require('fs')
const MongoQS = require('mongo-querystring')
const router = express.Router()

const winston = require('../config/winston')
const BulletinController = require('../controllers/BulletinController')
const OpenDataController = require('../controllers/OpenDataController')

/**
 * Daily APD bulletins
 */
router.get('/bulletin-reports', (req, res) => {
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

router.get('/bulletin-reports/description/:word', (req, res) => {
  BulletinController.bulletin_description(req.params.word)
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/bulletin-reports/officer/:officer', (req, res) => {
  BulletinController.bulletin_officer(req.params.officer)
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

// start && end dates are formatted `yyyymmdd`
router.get('/bulletin-reports/range/:start/:end', (req, res) => {
  BulletinController.bulletin_dates(req.params.start, req.params.end)
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})


/**
 * Open Data - Beats
 */
router.get('/open-data/beats', (req, res) => {
  OpenDataController.beats()
    .then(beats => res.status(200).send(beats))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})


/**
 * Open Data - Complaints
 */
router.get('/open-data/complaints', (req, res) => {
  const qs = new MongoQS()
  OpenDataController.complaints(qs.parse(req.query))
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})


/**
 * Open Data - Incidents
 */
router.get('/open-data/incidents', (req, res) => {
  const qs = new MongoQS()
  OpenDataController.incidents(qs.parse(req.query))
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})


/**
 * Open Data - Use of Force
 */
router.get('/open-data/use-of-force', (req, res) => {
  const qs = new MongoQS()
  OpenDataController.use_of_force(qs.parse(req.query))
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})


/**
 * Open Data -- Traffic stops
 */
router.get('/open-data/traffic-stops', (req, res) => {
  const qs = new MongoQS()
  OpenDataController.traffic_stops(qs.parse(req.query))
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open-data/traffic-stops/searches', (req, res) => {
  OpenDataController.ts_searches()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open-data/traffic-stops/arrests', (req, res) => {
  OpenDataController.ts_arrests()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open-data/traffic-stops/use-of-force', (req, res) => {
  OpenDataController.ts_use_of_force()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open-data/traffic-stops/daily-breakdown', (req, res) => {
  OpenDataController.ts_daily()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

router.get('/open-data/traffic-stops/statistics', (req, res) => {
  OpenDataController.ts_stats()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})


/**
 * Open Data -- Traffic stops (backups from our DB)
 */
router.get('/open-data-backups/traffic-stops', (req, res) => {
  OpenDataController.db_traffic_stops()
    .then(reports => res.status(200).send(reports))
    .catch(err => {
      winston.error(err)
      res.status(500).send([])
    })
})

module.exports = router
