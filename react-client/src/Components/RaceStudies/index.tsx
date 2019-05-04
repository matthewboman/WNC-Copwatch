import React from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles'

const RaceStudies = () => {
  return (
    <Grid container spacing={24}>
      <Grid item xs={12}>
        <Paper>
          <Typography>
            Comming soon...
          </Typography>
        </Paper>
      </Grid>
  </Grid>
  )
}

const styles: StyleRulesCallback = (theme: Theme) => ({
  paper: {
    height: "calc(100vh - 64px)"
  }
})

export default withStyles(styles)(RaceStudies)
