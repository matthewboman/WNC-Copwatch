import { OpenDataReport } from './OpenDataReport'

export default interface UseOfForce extends OpenDataReport {
    ia_no: string
    subject_id: string
    incident_type: string
    geo_beat: string
    type_force_used: string
    subject_resistence: string
    officer_condition_injury: string
    subject_sex: string
    subject_race: string
    disposition: string
    status: string
    subject_injury: string
}
