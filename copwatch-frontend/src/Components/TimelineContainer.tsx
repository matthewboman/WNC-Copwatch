import React, { Component, Fragment } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles'

import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import { scaleTime, scaleLinear } from '@vx/scale'
import { extent, max } from 'd3-array'

// accessors
const x = d =>  new Date(d.date)
const y = d => d.value

// bounds
const WIDTH = 1000
const HEIGHT = 400

// scales
const partialXScale = data => scaleTime({
  range: [0, WIDTH],
  domain: extent(data, x)
})
const partialYScale = data => scaleLinear({
  range: [HEIGHT, 0],
  domain: [0, max(data, y)]
})


interface TimelineContainer {
  stats: any[],
  classes: any
}

class TSTimelineContainer extends Component<TimelineContainer> {
  state = {
    graph: 'stops'
  }

  updateGraph = graph => {
    this.setState({ graph })
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { stats, classes } = this.props
    const { graph } = this.state

    return (
      <Fragment>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="graph">Traffic Stop Details</InputLabel>
          <Select
            value={graph}
            onChange={this.handleChange}
            inputProps={{
              name: 'graph',
              id: 'ts-graph',
            }}
          >
            <MenuItem value={'stops'}>Stops</MenuItem>
            <MenuItem value={'searches'}>Searches</MenuItem>
            <MenuItem value={'arrests'}>Arrests</MenuItem>
          </Select>
        </FormControl>
        {
          graph == 'stops' ? Stops(stats) : ''
        }
        {
          graph == 'searches' ? Searches(stats) : ''
        }
        {
          graph == 'arrests' ? Arrests(stats) : ''
        }
      </Fragment>
    )
  }
}

const Stops = stats => {
  const stops = stats.map(v => ({ date: v.date, value: v.stops }))
  const searches = stats.map(v => ({ date: v.date, value: v.searches }))
  const arrests = stats.map(v => ({ date: v.date, value: v.arrests }))

  const xScale = partialXScale(stops)
  const yScale = partialYScale(stops)

  return (
    <svg width={WIDTH} height={HEIGHT}>
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#242424" rx={14} />
      <LinePath
        data={stops}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#A2CAF2'}
        strokeWidth={1}
      />
      <LinePath
        data={arrests}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#BEF2A2'}
        strokeWidth={1}
      />
      <LinePath
        data={searches}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
  </svg>
  )
}

const Searches = stats => {
  const searches = stats.map(v => ({ date: v.date, value: v.searches }))
  const driver_searched = stats.map(v => ({ date: v.date, value: v.driver_searched }))
  const passenger_searched = stats.map(v => ({ date: v.date, value: v.passenger_searched }))
  const personal_effects_searched = stats.map(v => ({ date: v.date, value: v.personal_effects_searched }))
  const vehicle_searched = stats.map(v => ({ date: v.date, value: v.vehicle_searched }))

  const xScale = partialXScale(searches)
  const yScale = partialYScale(searches)

  return (
    <svg width={WIDTH} height={HEIGHT}>
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#242424" rx={14} />
      <LinePath
        data={searches}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={driver_searched}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={passenger_searched}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={personal_effects_searched}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={vehicle_searched}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
    </svg>
  )
}

const Arrests = stats => {
  const arrests = stats.map(v => ({ date: v.date, value: v.arrests }))
  const driver_arrested = stats.map(v => ({ date: v.date, value: v.driver_arrested }))
  const passenger_arrested = stats.map(v => ({ date: v.date, value: v.passenger_arrested }))

  const xScale = partialXScale(arrests)
  const yScale = partialYScale(arrests)

  return (
    <svg width={WIDTH} height={HEIGHT}>
      <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#242424" rx={14} />
      <LinePath
        data={arrests}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={driver_arrested}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={passenger_arrested}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
    </svg>
  )
}

const styles: StyleRulesCallback = (theme: Theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
})

export default withStyles(styles)(TSTimelineContainer)
