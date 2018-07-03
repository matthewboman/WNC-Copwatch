const axios = require('axios')

const details = [
  'address',
  'agency',
  'consent_by_code',
  'date_occurred',
  'driver_searched',
  'no_contraband_found',
  'off_phys_resis',
  'off_use_force',
  'passenger_arrested',
  'passenger_searched',
  'personal_effects_searched',
  'search_initiated',
  't_inc_arrest',
  't_pro_frisk',
  't_probable_cause',
  't_search_consent',
  't_search_warrant',
  'traffic_stop_id',
  'vehicle_searched'
]
const fields = details.join(',')
const BASE_URL = `https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDTrafficStops/FeatureServer/0/query?where=1%3D1&outFields=${fields}&outSR=4326&f=json`
const validDate = date => {
  const year = date.substring(0, 4)
  const month = date.substring(4, 6) - 1
  const day = date.substring(6, 8)
  const hour = date.substring(8, 10)
  const min = date.substring(10, 12)
  const sec = date.substring(12)
  return new Date(Date.UTC(year, month, day, hour, min, sec))
}

module.exports = {

  getApdData: () => axios.get(BASE_URL)
    .then(res => res.data.features.map(stop => {
        return ({
          "force": `${stop.attributes.agency}2`,
          "code": 'TS',
          "address": stop.attributes.address,
          "date": validDate(stop.attributes.date_occurred),
          "latLng": {
            "lat": stop.geometry.y,
            "lng": stop.geometry.x,
          },
          "driver_searched": stop.attributes.driver_searched || '',
          "no_contraband_found": stop.attributes.no_contraband_found || '',
          "passenger_searched": stop.attributes.passenger_searched || '',
          "passenger_arrested": stop.attributes.passenger_arrested || '',
          "personal_effects_searched": stop.attributes.personal_effects_searched || '',
          "search_initiated": stop.attributes.search_initiated || '',
          "t_inc_arrest": stop.attributes.t_inc_arrest || '',
          "vehicle_searched": stop.attributes.vehicle_searched || '',
        })
      })
    )
}
