import React, { useState } from 'react'
import { IconButton, TextField } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { StyleRulesCallback, Theme, withStyles, createStyles } from '@material-ui/core/styles'

const DateFilters = ({ classes, updateQuery }) => {
  const [before, setBefore] = useState('')
  const [after, setAfter] = useState('')

  return (
    <form className={classes.container} noValidate>
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
      <IconButton
        className={classes.iconButton}
        onClick={e => {
          e.preventDefault()
          updateQuery({ before, after })
        }}
        aria-label="Search"
      >
        <Search />
      </IconButton>
    </form>
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
