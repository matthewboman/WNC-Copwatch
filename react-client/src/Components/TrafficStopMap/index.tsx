import React, { Component } from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles, createStyles } from '@material-ui/core/styles'

import { MapContainer, MarkersLayer, DateFilters } from '..'
import { Styled } from '../../utils/types'
import { getLastWeek } from '../../utils/functions'
import { getStops, getStopDetails } from '../../utils/queries'

class TrafficStopsMap extends Component<Styled> {
  state = {
    variables: { }
  }

  componentDidMount = () => {
    // automatically query from past week
    const after = getLastWeek(new Date())
    this.setState({ variables: { after }})
  }

  updateQuery = variables => {
    this.setState({ variables })
  }

  render() {
    console.log('component TrafficStopsMap')

    const { variables } = this.state
    const { classes } = this.props

    return (
      <div className={classes.wtfMaterial}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <MapContainer>
              <MarkersLayer
                name='trafficStops'
                query={getStops}
                variables={variables}
                popupQuery={getStopDetails}
              />
            </MapContainer>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper>
              <DateFilters updateQuery={this.updateQuery} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const styles: StyleRulesCallback = (theme: Theme) => createStyles({
  // https://github.com/mui-org/material-ui/issues/7466
  wtfMaterial: {
    padding: 12
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
})

export default withStyles(styles)(TrafficStopsMap)
