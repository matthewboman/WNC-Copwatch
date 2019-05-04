import React, { Component } from 'react'
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

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Navigation />
          </header>
          <Style>
              <Route path="/" exact component={Home} />
              <Route path="/apd-bulletins" component={APDBulletinMap} />
              <Route path="/officer-info" component={OfficerInfo} />
              <Route path="/studies-houseless" component={HouselessStudies} />
              <Route path="/studies-race" component={RaceStudies} />
              <Route path="/studies-traffic" component={TrafficStopStudies} />
              <Route path="/traffic-stops" component={TrafficStopMap} />
          </Style>
        </div>
      </Router>
    )
  }
}

export default App
