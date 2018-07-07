/*
 * Uses Google's Map API to to return a valid [ lat, lng ].
 */

const GoogleMapsAPI = require('googlemaps')

const publicConfig = {
  key: process.env.GOOGLE_MAP_API,
  stagger_time: 1000,
  encode_polylines: false,
  secure: true
}

// geoLocation :: String -> Promise (Err {})
const geoLocation = address => new Promise((resolve, reject) => {
  const gmAPI = new GoogleMapsAPI(publicConfig)
  const geocodeParams = { address, language: 'en' }

  gmAPI.geocode(geocodeParams, (err, res) => {
    if (err) {
      reject(err)
    }
    if (res && res.results[0]) {
      resolve(res.results[0].geometry.location)
    }
    resolve(null)
  })
})

module.exports = geoLocation
