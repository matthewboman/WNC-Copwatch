import React, { Component } from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles'

// TODO: get `withStyles` working w/ TypeScript
// https://material-ui.com/guides/typescript/

const styles: StyleRulesCallback = (theme: Theme) => ({
  paper: {
    height: "calc(100vh - 64px)"
  }
})

class StudiesHouseless extends Component {
  state = {

  }

  render() {
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
}

export default StudiesHouseless
