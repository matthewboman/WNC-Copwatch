const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

const apdApi = require('./utils/apdApi')
const api = require('./routes/api')

mongoose.connect(process.env.DB_URL, (err, res) => {
  if (err) {
    console.error('Database connection failed: ', err)
  }
})

const app = express()
app.use(express.static(path.join(__dirname + '/public')))
app.set('port', (process.env.PORT || 3000))
app.use('/api', api)

/*
Allow Vue app running on hot-reloading dev server to make API requests
*/
if (process.env.NODE_ENV == 'development') {
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

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}`)
})

module.exports = app
