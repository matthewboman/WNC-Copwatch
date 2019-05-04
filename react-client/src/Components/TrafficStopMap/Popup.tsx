import React, { Fragment } from 'react'
import { Typography } from '@material-ui/core'

export default ({ stop }) => {
  console.log(stop)
  return (
  <Fragment>
    <Typography>
      Address: { stop.address }
    </Typography>
    <Typography>
      Reason: { stop.reason }
    </Typography>
  </Fragment>
)}
