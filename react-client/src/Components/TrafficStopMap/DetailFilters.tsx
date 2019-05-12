import React from 'react'
import {
  FormLabel,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  } from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles, createStyles } from '@material-ui/core/styles'

const DetailFilters = ({
  classes,
  search,
  arrest,
  setSearch,
  setArrest
}) => {
  return (
    <FormControl className={classes.formControl}>
      <FormLabel>Filter details</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={search}
              onChange={setSearch}
              value="search"
            />
          }
          label="Stops followed by a search"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={arrest}
              onChange={setArrest}
              value="arrest"
            />
          }
          label="Stops followed by an arrest"
        />
      </FormGroup>
    </FormControl>
  )
}

const styles: StyleRulesCallback = (theme: Theme) => createStyles({

})

export default withStyles(styles)(DetailFilters)
