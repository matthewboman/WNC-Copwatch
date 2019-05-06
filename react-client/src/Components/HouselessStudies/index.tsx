import React from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles'

import HeatMap from './HeatMap'
import { Styled } from '../../utils/types'

const HouselessStudies = ({ classes }) => {
  console.log('component HouselessStudies')

  return (
    <Grid container spacing={24}>
      <Grid item xs={12}>
        <HeatMap />
      </Grid>
    </Grid>
  )
}

const styles: StyleRulesCallback = (theme: Theme) => ({
  paper: {
    height: "calc(100vh - 64px)"
  }
})

export default withStyles(styles)(HouselessStudies)
