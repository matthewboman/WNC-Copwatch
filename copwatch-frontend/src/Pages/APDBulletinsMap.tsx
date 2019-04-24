import React, { Component } from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles, createStyles } from '@material-ui/core/styles'

import { MapContainer, MapFilters } from '../Components'
import { getBulletins, getBulletinDetails } from '../utils/queries'
import { Styled } from '../utils/types'
import { getLastWeek } from '../utils/functions'

class APDBulletinsMap extends Component<Styled> {
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
    const { variables } = this.state
    const { classes } = this.props

    return (
      <div className={classes.wtfMaterial}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6}>
            <MapContainer
              query={getBulletins}
              variables={variables}
              popupQuery={getBulletinDetails}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper>
              <MapFilters
                updateQuery={this.updateQuery}
              />
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

export default withStyles(styles)(APDBulletinsMap)
