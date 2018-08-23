const express = require('express')
const fs = require('fs')
const MongoQS = require('mongo-querystring')
const router = express.Router()
const ReportsController = require('../controllers/ReportsController')

/*
 * open data from arcgis and daily police bulletins
 */
router.get('/reports', (req, res) => {
  ReportsController.allReports()
    .then(reports => res.status(200).send(reports))
    .catch(err => res.status(500).send([]))
})

/*
 * open data from arcgis
 */
router.get('/open_data_reports', (req, res) => {
  ReportsController.odr()
    .then(reports => res.status(200).send(reports))
    .catch(err => res.status(500).send([]))
})

router.get('/open_data_reports/searches', (req, res) => {
  ReportsController.odr_searches()
    .then(reports => res.status(200).send(reports))
    .catch(err => res.status(500).send([]))
})

router.get('/open_data_reports/arrests', (req, res) => {
  ReportsController.odr_arrests()
    .then(reports => res.status(200).send(reports))
    .catch(err => res.status(500).send([]))
})

/*
 * daily APD bulletins
 */
router.get('/bulletin_reports', (req, res) => {
  if (Object.keys(req.query).length) {
    const qs = new MongoQS()
    ReportsController.byQueryString(qs.parse(req.query))
      .then(reports => res.status(200).send(reports) )
      .catch(err => res.status(500).send(err))
  } else {
    ReportsController.bulletin()
      .then(reports => res.status(200).send(reports))
      .catch(err => res.status(500).send([]))
  }
})

router.get('/bulletin_reports/create_backup/:filename', (req, res) => {
  ReportsController.bulletin()
    .then(reports => {
      fs.writeFile(req.params.filename, JSON.stringify(reports), 'utf8', (err, res) => {
        if (err) {
          console.log('err', err)
        }
        console.log(res)
      })
    })
    .catch(err => res.status(500).send([]))
})

router.get('/bulletin_reports/seed_database/:filename', (req, res) => {
  ReportsController.reformat_dump(req.params.filename)
    .then(reports => res.status(200).send(reports))
    .catch(err => res.status(500).send([]))
})

router.get('/bulletin_reports/description/:word', (req, res) => {
  ReportsController.bulletin_description(req.params.word)
    .then(reports => res.status(200).send(reports))
    .catch(err => res.status(500).send([]))
})

router.get('/bulletin_reports/officer/:officer', (req, res) => {
  ReportsController.bulletin_officer(req.params.officer)
    .then(reports => res.status(200).send(reports))
    .catch(err => res.status(500).send([]))
})

/*
 * start && end are formatted `yyyymmdd`
 */
router.get('/bulletin_reports/range/:start/:end', (req, res) => {
  ReportsController.bulletin_dates(req.params.start, req.params.end)
    .then(reports => res.status(200).send(reports))
    .catch(err => res.status(500).send([]))
})

module.exports = router
