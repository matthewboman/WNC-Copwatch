import React, { Fragment } from 'react'
import { Typography } from '@material-ui/core'

const Popup = ({ stop }) => (
  <Fragment>
    <Typography>
      Address: { stop.address }
    </Typography>
    <Typography>
      Reason: { stop.reason }
    </Typography>
  </Fragment>
)

export default React.memo(Popup)
