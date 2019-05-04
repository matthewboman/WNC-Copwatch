import React, { Fragment, useState } from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles'

import ArrestsLineGraph from './ArrestsLineGraph'
import SearchesLineGraph from './SearchesLineGraph'
import StopsLineGraph from './StopsLineGraph'

const TimelineContainer = ({ dimensions, stats, classes }) => {
  const [graphType, setGraphType] = useState('stops')

  return (
    <Fragment>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="graph">Traffic Stop Details</InputLabel>
        <Select
          value={graphType}
          onChange={e => setGraphType(e.target.value)}
          inputProps={{
            name: 'graph',
            id: 'ts-graph',
          }}
        >
          <MenuItem value={'stops'}>Stops</MenuItem>
          <MenuItem value={'searches'}>Searches</MenuItem>
          <MenuItem value={'arrests'}>Arrests</MenuItem>
        </Select>
      </FormControl>
      {
        graphType == 'stops' ? StopsLineGraph(dimensions, stats) : ''
      }
      {
        graphType == 'searches' ? SearchesLineGraph(dimensions, stats) : ''
      }
      {
        graphType == 'arrests' ? ArrestsLineGraph(dimensions, stats) : ''
      }
    </Fragment>
  )
}

const styles: StyleRulesCallback = (theme: Theme) => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
})

export default withStyles(styles)(TimelineContainer)
