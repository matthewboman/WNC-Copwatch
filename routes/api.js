const express = require('express')
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
  ReportsController.bulletin()
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

router.get('/bulletin_reports/range/:start/:end', (req, res) => {
  ReportsController.bulletin_dates(req.params.start, req.params.end)
    .then(reports => res.status(200).send(reports))
    .catch(err => res.status(500).send([]))
})

module.exports = router
