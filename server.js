const express = require('express')
const fs = require('fs')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

const mockData = require('./reports/mockData')

const app = express()
app.use(express.static(path.join(__dirname + '/public')))
let db

/*
Allow Vue app running on hot-reloading dev server to make API requests
*/
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'testing') {
  const ALLOWED_SITES = [ 'http://localhost:8080' ]
  const ALLOWED_METHODS = [ 'GET' ]

  app.use((req, res, next) => {
    for (site of ALLOWED_SITES) {
      res.setHeader('Access-Control-Allow-Origin', site)
    }
    res.setHeader('Access-Control-Allow-Methods', ...ALLOWED_METHODS)
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
  })
}

/* running tests w/o database connection */
if (process.env.NODE_ENV == 'testing') {
  app.get('/reports', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    console.log(mockData.reports)
    res.send(mockData.reports)
    return
  })

  app.listen(3000, () => console.log(`listening on 3000`))

/* development and production */
} else {
  app.get('/reports', (req, res) => {
    db.collection('reports').find().toArray((err, results) => {
      res.setHeader('Content-Type', 'application/json')
      const reports = err ? [] : results
      res.send(reports)
      return
    })
  })

  MongoClient.connect(process.env.DB_URL, (err, client) => {
    if (err) {
      return console.log('Databse connection failed: ', err)
    }
    db = client.db('police_reports')
    app.listen(3000, () => console.log(`listening on 3000`))
  })
}
