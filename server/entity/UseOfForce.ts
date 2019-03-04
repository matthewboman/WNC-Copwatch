import { OpenDataReport } from './OpenDataReport'

export default interface UseOfForce extends OpenDataReport {
    ia_no: String
    subject_id: String
    incident_type: String
    geo_beat: String
    type_force_used: String
    subject_resistence: String
    officer_condition_injury: String
    subject_sex: String
    subject_race: String
    disposition: String
    status: String
    subject_injury: String
}
