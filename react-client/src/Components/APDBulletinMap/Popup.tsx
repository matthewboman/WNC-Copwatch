import React, { Fragment } from 'react'
import { Typography } from '@material-ui/core'

const Popup = ({ stop }) => (
  <Fragment>
    <Typography>
      Date: { stop.date }
    </Typography>
    <Typography>
      Address: { stop.address }
    </Typography>
    <Typography>
      Officer: { stop.lastName }
    </Typography>
    <Typography>
      Reason: { stop.description }
    </Typography>
  </Fragment>
)

export default React.memo(Popup)
