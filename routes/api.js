const express = require('express')
const router = express.Router()
const ReportsController = require('../controllers/ReportsController')

router.get('/reports', (req, res) => {
  ReportsController.allReports()
    .then(reports => res.send(reports))
})

router.get('/reports/:searchTerm', (req, res) => {
  // db.collection('reports').find({ $text: { $search: req.params.searchTerm } }).toArray((err, results) => {
  //   res.setHeader('Content-Type', 'application/json')
  //   const reports = err ? [] : results
  //   res.send(reports)
  //   return
  // })
})

module.exports = router
