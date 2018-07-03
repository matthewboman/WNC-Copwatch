const mongoose = require('mongoose')

const report = new mongoose.Schema({
  force: { type: String, default: '' },
  code: { type: String, default: '' },
  description: { type: String, default: '' },
  address: { type: String, default: '' },
  dateTime: { type: Date, default: Date.now },
  race: { type: String, default: '' },
  officer: { type: String, default: '' },
  latLng: { type: Object, default: {} },
})

report.methods.summary = () => ({
  id: this._id,
  force: this.force,
  code: this.code,
  description: this.description,
  address: this.address,
  dateTime: this.dateTime,
  race: this.race,
  officer: this.officer,
  latLng: this.latLng,
})

module.exports = mongoose.model('report', report)
