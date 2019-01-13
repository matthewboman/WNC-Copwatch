const axios = require("axios")
const fns = require("../utils/functions")

/**
 * Beats
 *
 * http://arcgis.ashevillenc.gov/arcgis/rest/services/Boundaries/LawBeats/MapServer//0/query?where=1%3D1&outFields=*&outSR=4326&f=json
 */
const BEATS_URL = `http://arcgis.ashevillenc.gov/arcgis/rest/services/Boundaries/LawBeats/MapServer//0/query?where=1%3D1&outFields=*&outSR=4326&f=json`

const getBeats = () => axios.get(BEATS_URL)
  .then(res => res.data.features)
  .catch(err => console.log(err))

/**
 * Complaints
 *
 * https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDComplaints/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json
 */
const COMPLAINTS_BASE_URL = `https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDComplaints/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`

const getComplaintData = () => axios.get(COMPLAINTS_BASE_URL)
  .then(res => res.data.features)
  .catch(err => console.log(err))

/**
 * Public Incident Data
 *
 * https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/Layers/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json
 */
const INCIDENT_URL = `https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/Layers/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`

const getIncidentsData = () => axios.get(INCIDENT_URL)
  .then(res => res.data.features)
  .catch(err => console.log(err))

/**
 * Traffic Stops
 *
 * http://data.ashevillenc.gov/datasets/apd-traffic-stops-after-oct-1-2017/geoservice
 */
const ts_details = [
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
  'stop_sbi_desc',
  't_inc_arrest', //
  't_pro_frisk',
  't_probable_cause', //
  't_search_consent', //
  't_search_warrant', //
  'traffic_stop_id',
  'vehicle_searched' //
]
const ts_fields = ts_details.join(',')
const TS_BASE_URL = `https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDTrafficStops/FeatureServer/0/query?where=1%3D1&outFields=${ts_fields}&outSR=4326&f=json`
const TS_URL = `https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDTrafficStops/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`
const getTSData = () => axios.get(TS_URL)
  .then(res => res.data.features.map(stop => {
      return ({
        "address": stop.attributes.address,
        "agency": stop.attributes.agency || '',
        "consent_by_code": stop.attributes.consent_by_code || '',
        "dateTime": fns.validDate(stop.attributes.date_occurred),
        "latLng": {
          "lat": stop.geometry ? stop.geometry.y : 'none',
          "lng": stop.geometry ? stop.geometry.x : 'none',
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
        "stop_sbi_desc": stop.attributes.stop_sbi_desc || '',
        "t_inc_arrest": stop.attributes.t_inc_arrest || '',
        "t_pro_frisk": stop.attributes.t_pro_frisk || '',
        "t_probable_cause": stop.attributes.t_probable_cause || '',
        "t_search_consent": stop.attributes.t_search_consent || '',
        "t_search_warrant": stop.attributes.t_search_warrant || '',
        "traffic_stop_id": stop.attributes.traffic_stop_id || '',
        "vehicle_searched": stop.attributes.vehicle_searched || '',
        // details specific to our app
        "force": `${stop.attributes.agency}_open`,
        "code": 'TC',
      })
    })
  )

/**
 * Use of Force
 *
 * https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDUseOfForce/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json
 *
 * geometry
 * https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/Layers/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-9392582.035678009%2C%22ymin%22%3A4226661.916050661%2C%22xmax%22%3A-9314310.518713959%2C%22ymax%22%3A4304933.433014713%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&outSR=102100&resultType=tile
 */
const USE_OF_FORCE_URL = `https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDUseOfForce/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`

const getUseOfForceData = () => axios.get(USE_OF_FORCE_URL)
  .then(res => res.data.features)
  .catch(err => console.log(err))


module.exports = {
  getBeats,
  getComplaintData,
  getIncidentsData,
  getTSData,
  getUseOfForceData
}
