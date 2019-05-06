import React from 'react'
import { Link } from 'react-router-dom'

const APDBulletinMapLink = props => <Link to="/apd-bulletins-map" {...props} />
const Home = props => <Link to="/" {...props} />
const HouselessStudiesLink = props => <Link to="/houseless-studies" {...props} />
const OfficerLink = props => <Link to="/officer-info" {...props} />
const RaceStudiesLink = props => <Link to="/race-studies" {...props} />
const TrafficStopMapLink = props => <Link to="/traffic-stops-map" {...props} />
const TrafficStopStudiesLink = props => <Link to="/traffic-stop-studies" {...props} />

export {
  APDBulletinMapLink,
  Home,
  HouselessStudiesLink,
  OfficerLink,
  RaceStudiesLink,
  TrafficStopMapLink,
  TrafficStopStudiesLink,
}
