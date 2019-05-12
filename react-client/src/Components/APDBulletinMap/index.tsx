import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { StyleRulesCallback, Theme, withStyles, createStyles } from '@material-ui/core/styles'

import { MarkersLayer, DateFilters } from '..'
import { Styled } from '../../utils/types'
import { getLastWeek } from '../../utils/functions'
import { getBulletins, getBulletinDetails } from '../../utils/queries'

interface BulletinVariables {
  after?: string
  before?: string
  lastName?: string
  description?: string
}

const APDBulletinsMap = ({ classes }) => {
  const [ before, setBefore ] = useState('')
  const [ after, setAfter ] = useState(getLastWeek(new Date))
  const [ lastName, setLastName ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ feedback, setFeedback ] = useState('')

  const [
    variables,
    setVariables
  ]: [ BulletinVariables, Function ] = useState({ after: getLastWeek(new Date()) })

  return (
    <div className={classes.wtfMaterial}>
      { feedback &&
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography>{feedback}</Typography>
          </Grid>
        </Grid>
      }
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <MarkersLayer
            name='apdBulletins'
            query={getBulletins}
            variables={variables}
            popupQuery={getBulletinDetails}
            setFeedback={setFeedback}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper>
            <form className={classes.container} noValidate>
              <DateFilters
                after={after}
                before={before}
                setAfter={setAfter}
                setBefore={setBefore}
              />
              <br />
              <FormControl className={classes.formControl}>
                <FormLabel>Filter details</FormLabel>
                <TextField
                  id="search-by-officer"
                  label="Officer last name"
                  className={classes.textField}
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  margin="normal"
                />
                <br />
                <TextField
                  id="search-by-description"
                  label="Description"
                  className={classes.textField}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  margin="normal"
                />
                <br />
              </FormControl>
              <IconButton
                className={classes.iconButton}
                onClick={e => {
                  e.preventDefault()
                  setFeedback('')

                  // we only want to query fields we've used
                  setVariables({
                    ...before && { before },
                    ...after && { after },
                    ...lastName && { lastName },
                    ...description && { description }
                  })
                }}
                aria-label="Search"
              >
                <Search />
              </IconButton>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

const styles: StyleRulesCallback = (theme: Theme) => createStyles({
  // https://github.com/mui-org/material-ui/issues/7466
  wtfMaterial: {
    padding: 12
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
})

export default withStyles(styles)(APDBulletinsMap)
