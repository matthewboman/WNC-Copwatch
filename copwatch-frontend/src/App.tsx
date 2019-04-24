import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import styled from 'styled-components'

import { Navbar } from './Components'
import {
  APDBulletinsMap,
  Home,
  OfficerInfo,
  StudiesHouseless,
  StudiesRace,
  StudiesTraffic,
  TrafficStopsMap
} from './Pages'

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
            <Navbar />
          </header>
          <Style>
              <Route path="/" exact component={Home} />
              <Route path="/apd-bulletins" component={APDBulletinsMap} />
              <Route path="/officer-info" component={OfficerInfo} />
              <Route path="/studies-houseless" component={StudiesHouseless} />
              <Route path="/studies-race" component={StudiesRace} />
              <Route path="/studies-traffic" component={StudiesTraffic} />
              <Route path="/traffic-stops" component={TrafficStopsMap} />
          </Style>
        </div>
      </Router>
    )
  }
}

export default App
