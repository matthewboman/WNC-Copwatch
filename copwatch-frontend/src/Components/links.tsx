import React from 'react'
import { Link } from 'react-router-dom'

const APDLink = props => <Link to="/apd-bulletins" {...props} />
const Home = props => <Link to="/" {...props} />
const HouselessStudiesLink = props => <Link to="/studies-houseless" {...props} />
const OfficerLink = props => <Link to="/officer-info" {...props} />
const RaceStudiesLink = props => <Link to="/studies-race" {...props} />
const TrafficLink = props => <Link to="/traffic-stops" {...props} />
const TrafficStudiesLink = props => <Link to="/studies-traffic" {...props} />

export {
  APDLink,
  Home,
  HouselessStudiesLink,
  OfficerLink,
  RaceStudiesLink,
  TrafficLink,
  TrafficStudiesLink,
}
