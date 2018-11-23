const mongoose = require('mongoose')

const traffic_stop = new mongoose.Schema({
    force: { type: String, default: '' },
    code: { type: String, default: 'TC' },
    address: { type: String, default: '' },
    dateTime: { type: Date, default: Date.now },
    latLng: { type: Object, default: {} },
    driver_searched: { type: String, default: '' },
    driver_arrested: { type: String, default: '' },
    no_contraband_found: { type: String, default: '' },
    off_phys_resis: { type: String, default: '' },
    off_use_force: { type: String, default: '' },
    passenger_arrested: { type: String, default: '' },
    passenger_searched: { type: String, default: '' },
    personal_effects_searched: { type: String, default: '' },
    search_initiated: { type: String, default: '' },
    stop_sbi_desc: { type: String, default: '' },
    t_inc_arrest: { type: String, default: '' },
    t_pro_frisk: { type: String, default: '' },
    t_probable_cause: { type: String, default: '' },
    t_search_consent: { type: String, default: '' },
    t_search_warrant: { type: String, default: '' },
    traffic_stop_id: { type: String, default: '' },
    vehicle_searched: { type: String, default: '' },
})

module.exports = mongoose.model('traffic_stop', traffic_stop)
