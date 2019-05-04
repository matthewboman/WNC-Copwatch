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
  .then(res => res.data.features.map(complaint => {
    return ({
      incident_type: complaint.attributes.incident_type || '',
      dateTime: complaint.attributes.occurred_date || '', // standardize to other APIs
      disposition: complaint.attributes.disposition || '',
      status: complaint.attributes.status || '',
      allegation: complaint.attributes.allegation || '',
      ia_no: complaint.attributes.ia_no || '',
      objectid: complaint.attributes.objectid || ''
    })
  }))
  .catch(err => console.log(err))

/**
 * Public Incident Data
 *
 * https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/Layers/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json
 */
const INCIDENT_URL = `https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/Layers/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`

const getIncidentsData = () => axios.get(INCIDENT_URL)
  .then(res => res.data.features.map(incident => {
    return ({
      agency: incident.attributes.agency || '',
      dateTime: incident.attributes.date_occurred || '', // standardize to other APIs
      address: incident.attributes.address || '',
      geo_beat: incident.attributes.geo_beat || '',
      geo_report_area: incident.attributes.geo_report_area || '',
      latLng: {
        lat: incident.geometry ? incident.geometry.y : 'none',
        lng: incident.geometry ? incident.geometry.x : 'none',
      },
      offense_short_description: incident.attributes.offense_short_description || '',
      offense_long_description: incident.attributes.offense_long_description || '',
      offense_code: incident.attributes.offense_code || '',
      offense_group_code: incident.attributes.offense_group_code || '',
      offense_group_level: incident.attributes.offense_group_level || '',
      force: `${incident.attributes.agency}_open`,
    })
  }))
  .catch(err => console.log(err))

/**
 * Traffic Stops
 *
 * http://data.ashevillenc.gov/datasets/apd-traffic-stops-after-oct-1-2017/geoservice
 */
const TS_URL = `https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDTrafficStops/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`

const getTSData = () => axios.get(TS_URL)
  .then(res => res.data.features.map(stop => {
      return ({
        address: stop.attributes.address,
        agency: stop.attributes.agency || '',
        consent_by_code: stop.attributes.consent_by_code || '',
        dateTime: fns.validDate(stop.attributes.date_occurred), // standardize to other APIs
        latLng: {
          lat: stop.geometry ? stop.geometry.y : 'none',
          lng: stop.geometry ? stop.geometry.x : 'none',
        },
        driver_searched: stop.attributes.driver_searched || '',
        driver_arrested: stop.attributes.driver_arrested || '',
        no_contraband_found: stop.attributes.no_contraband_found || '',
        off_phys_resis: stop.attributes.off_phys_resis || '',
        off_use_force: stop.attributes.off_use_force || '',
        passenger_arrested: stop.attributes.passenger_arrested || '',
        passenger_searched: stop.attributes.passenger_searched || '',
        personal_effects_searched: stop.attributes.personal_effects_searched || '',
        search_initiated: stop.attributes.search_initiated || '',
        stop_sbi_desc: stop.attributes.stop_sbi_desc || '',
        t_inc_arrest: stop.attributes.t_inc_arrest || '',
        t_pro_frisk: stop.attributes.t_pro_frisk || '',
        t_probable_cause: stop.attributes.t_probable_cause || '',
        t_search_consent: stop.attributes.t_search_consent || '',
        t_search_warrant: stop.attributes.t_search_warrant || '',
        traffic_stop_id: stop.attributes.traffic_stop_id || '',
        vehicle_searched: stop.attributes.vehicle_searched || '',
        // details specific to our app
        force: `${stop.attributes.agency}_open`,
        code: 'TC',
      })
    })
  )

/**
 * Use of Force
 *
 * https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDUseOfForce/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json
 *
 */
const USE_OF_FORCE_URL = `https://services.arcgis.com/aJ16ENn1AaqdFlqx/arcgis/rest/services/APDUseOfForce/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`

const getUseOfForceData = () => axios.get(USE_OF_FORCE_URL)
  .then(res => res.data.features.map(incident => {
    return ({
      objectid: incident.attributes.objectid || '',
      ia_no: incident.attributes.ia_no || '',
      subject_id: incident.attributes.subject_id || '',
      incident_type: incident.attributes.incident_type || '',
      geo_beat: incident.attributes.county_location || '',
      dateTime: incident.attributes.occurred_date || '', // standardize to other APIs
      type_force_used: incident.attributes.type_force_used || '',
      subject_resistence: incident.attributes.subject_resistence || '',
      officer_condition_injury: incident.attributes.officer_condition_injury || '',
      subject_sex: incident.attributes.subject_sex || '',
      subject_race: incident.attributes.subject_race || '',
      disposition: incident.attributes.disposition || '',
      status: incident.attributes.status || '',
      subject_injury: incident.attributes.subject_injury || ''
    })
  }))
  .catch(err => console.log(err))

module.exports = {
  getBeats,
  getComplaintData,
  getIncidentsData,
  getTSData,
  getUseOfForceData
}
