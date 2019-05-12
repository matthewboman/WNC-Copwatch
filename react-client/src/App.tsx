import React  from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import styled from 'styled-components'

import {
  APDBulletinMap,
  Home,
  HouselessStudies,
  Navigation,
  OfficerInfo,
  RaceStudies,
  TrafficStopMap,
  TrafficStopStudies
} from './Components'

const Style = styled.div`
  height: calc(100% - 56px);
  margin-top: 56px;
`

export default () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navigation />
        </header>
        <Style>
          <Route path="/" exact component={Home} />
          <Route path="/apd-bulletins-map" component={APDBulletinMap} />
          <Route path="/officer-info" component={OfficerInfo} />
          <Route path="/houseless-studies" component={HouselessStudies} />
          <Route path="/race-studies" component={RaceStudies} />
          <Route path="/traffic-stop-studies" component={TrafficStopStudies} />
          <Route path="/traffic-stops-map" component={TrafficStopMap} />
        </Style>
      </div>
    </Router>
  )
}
