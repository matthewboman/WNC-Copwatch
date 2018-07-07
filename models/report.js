const mongoose = require('mongoose')

const report = new mongoose.Schema({
  report_id: { type: String, default: '' },
  force: { type: String, default: '' },
  code: { type: String, default: '' },
  description: { type: String, default: '' },
  address: { type: String, default: '' },
  dateTime: { type: Date, default: Date.now },
  race: { type: String, default: '' },
  officer: { type: String, default: '' },
  latLng: { type: Object, default: {} },
})

module.exports = mongoose.model('report', report)
