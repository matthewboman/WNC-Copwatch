import React from 'react'
import { Link } from 'react-router-dom'

const APDBulletinMapLink = props => <Link to="/apd-bulletins" {...props} />
const Home = props => <Link to="/" {...props} />
const HouselessStudiesLink = props => <Link to="/studies-houseless" {...props} />
const OfficerLink = props => <Link to="/officer-info" {...props} />
const RaceStudiesLink = props => <Link to="/studies-race" {...props} />
const TrafficStopMapLink = props => <Link to="/traffic-stops" {...props} />
const TrafficStopStudiesLink = props => <Link to="/studies-traffic" {...props} />

export {
  APDBulletinMapLink,
  Home,
  HouselessStudiesLink,
  OfficerLink,
  RaceStudiesLink,
  TrafficStopMapLink,
  TrafficStopStudiesLink,
}
