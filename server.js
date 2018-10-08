const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const morgan = require('morgan')
require('dotenv').config()

const index = require('./routes/index')
const api = require('./routes/api')
const winston = require('./config/winston')

/*
 * Connect to MongoDB
 */
mongoose.connect(process.env.DB_URL, (err, res) => {
  if (err) {
    winston.error(`DB CONNECTION FAILED: ${err}`)
  }
})

/*
 * Configure Express Application
 */
const app = express()
app.use(morgan('combined', { stream: winston.stream }))
app.use(express.static(path.join(__dirname + '/public')))
app.set('port', (process.env.PORT || 3000))

/*
 * Routing
 */

// Allow other to use our API
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Allow-Methods', 'GET')
  next()
})

// Application routes
app.use('/api/v1', api)
app.use('/', index)
app.use('*', (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

// Handle errors for incorrect routes
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
  res.status(404).send('This page does not exist!');
})

/*
 * Initialize App
 */
app.listen(app.get('port'), () => {
  winston.info(`App is running on ${app.get('port')}`)
})

module.exports = app
