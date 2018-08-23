const express = require('express')
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
require('dotenv').config()

const api = require('./routes/api')

mongoose.connect(process.env.DB_URL_LOCAL, (err, res) => {
  if (err) {
    console.error('Database connection failed: ', err)
  }
})

const app = express()
app.use(express.static(path.join(__dirname + '/public')))
app.set('port', (process.env.PORT || 3000))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Allow-Methods', 'GET')
  next()
})
app.use('/api', api)

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}`)
})

module.exports = app
