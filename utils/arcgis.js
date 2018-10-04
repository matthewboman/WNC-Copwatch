/*
 * http://data.ashevillenc.gov/datasets/apd-traffic-stops-after-oct-1-2017/geoservice
 */

const axios = require('axios')
const fns = require('./functions')

const details = [
  'address',
  'agency',
  'consent_by_code',
  'date_occurred',
  'driver_searched', //
  'driver_arrested', //
  'no_contraband_found',
  'off_phys_resis', //
  'off_use_force',
  'passenger_arrested', //
  'passenger_searched', //
  'personal_effects_searched', //
  'search_initiated', //
  't_inc_arrest', //
  't_pro_frisk',
  't_probable_cause', //
  't_search_consent', //
  't_search_warrant', //
  'traffic_stop_id',
  'vehicle_searched' //
]
const fields = details.join(',')
const BASE_URL = `https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDTrafficStops/FeatureServer/0/query?where=1%3D1&outFields=${fields}&outSR=4326&f=json`

module.exports = {

  getApdData: () => axios.get(BASE_URL)
    .then(res => res.data.features.map(stop => {
        return ({
          "force": `${stop.attributes.agency}_open`,
          "code": 'TC',
          "address": stop.attributes.address,
          "dateTime": fns.validDate(stop.attributes.date_occurred),
          "latLng": {
            "lat": stop.geometry.y,
            "lng": stop.geometry.x,
          },
          "driver_searched": stop.attributes.driver_searched || '',
          "driver_arrested": stop.attributes.driver_arrested || '',
          "no_contraband_found": stop.attributes.no_contraband_found || '',
          "off_phys_resis": stop.attributes.off_phys_resis || '',
          "off_use_force": stop.attributes.off_use_force || '',
          "passenger_arrested": stop.attributes.passenger_arrested || '',
          "passenger_searched": stop.attributes.passenger_searched || '',
          "personal_effects_searched": stop.attributes.personal_effects_searched || '',
          "search_initiated": stop.attributes.search_initiated || '',
          "t_inc_arrest": stop.attributes.t_inc_arrest || '',
          "t_pro_frisk": stop.attributes.t_pro_frisk || '',
          "t_probable_cause": stop.attributes.t_probable_cause || '',
          "t_search_consent": stop.attributes.t_search_consent || '',
          "t_search_warrant": stop.attributes.t_search_warrant || '',
          "traffic_stop_id": stop.attributes.traffic_stop_id || '',
          "vehicle_searched": stop.attributes.vehicle_searched || '',
        })
      })
    )
}
