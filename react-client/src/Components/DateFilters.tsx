import React from 'react'
import { FormControl, FormLabel, TextField } from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles, createStyles } from '@material-ui/core/styles'

const DateFilters = ({
  classes,
  after,
  before,
  setAfter,
  setBefore
}) => {
  return (
    <FormControl className={classes.formControl}>
      <FormLabel>Filter by date</FormLabel>
      <TextField
        id="date"
        label="after"
        type="date"
        defaultValue={after}
        className={classes.textField}
        onChange={e => setAfter(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="date"
        label="before"
        type="date"
        defaultValue={before}
        className={classes.textField}
        onChange={e => setBefore(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </FormControl>
  )
}

const styles: StyleRulesCallback = (theme: Theme) => createStyles({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  iconButton: {
    padding: 10,
  }
})

export default withStyles(styles)(DateFilters)
