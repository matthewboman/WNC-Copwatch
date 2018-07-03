const reportModel = require('../models/report')
const arcgis = require('../utils/arcgis')

let arcgis_cache = []
let mongo_cache = []

const getArcgisData = () => arcgis.getApdData()

const getMongoData = () => {
  return new Promise((resolve, reject)=> {
    reportModel.find({}, (err, reports) => {
      if (err) {
        reject(err)
      }
      resolve(reports)
    })
  })
}

async function combineReports() {
  const mongo = await getMongoData()
  const arc = await getArcgisData()
  return [...arc, ...mongo]
}

module.exports = {

  allReports: () => combineReports(),



}
