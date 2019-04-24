import React, { Component } from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles'

import { MapContainer } from '../Components'
import { getTargettedBulletins } from '../utils/queries'
import { Styled } from '../utils/types'

class StudiesHouseless extends Component<Styled> {
  state = {

  }

  render() {
    const variables = { target: "houseless" }
    return (
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <MapContainer
            query={getTargettedBulletins}
            variables={variables}
            popupQuery={null}
          />
        </Grid>
      </Grid>
    )
  }
}

const styles: StyleRulesCallback = (theme: Theme) => ({
  paper: {
    height: "calc(100vh - 64px)"
  }
})

export default StudiesHouseless
