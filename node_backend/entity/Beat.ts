import LatLng from './LatLng'

export default interface Beat {
  id: Number
  beat: String
  outline: Array<LatLng>
}
