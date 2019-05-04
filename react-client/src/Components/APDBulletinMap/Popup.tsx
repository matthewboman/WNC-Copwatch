import React, { Fragment } from 'react'
import { Typography } from '@material-ui/core'

export default ({ stop }) => (
  <Fragment>
    <Typography>
      Date: { stop.date }
    </Typography>
    <Typography>
      Address: { stop.address }
    </Typography>
    <Typography>
      Reason: { stop.description }
    </Typography>
  </Fragment>
)
