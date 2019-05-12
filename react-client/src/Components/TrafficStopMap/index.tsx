import React, { useState } from 'react'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography
} from '@material-ui/core'
import { StyleRulesCallback, Theme, withStyles, createStyles } from '@material-ui/core/styles'
import { IconButton, TextField } from '@material-ui/core'
import { Search } from '@material-ui/icons'


import { MarkersLayer, DateFilters } from '..'
import DetailFilters from './DetailFilters'
import { Styled } from '../../utils/types'
import { getLastWeek } from '../../utils/functions'
import { getStops, getStopDetails } from '../../utils/queries'

interface TrafficStopVariables {
  after?: string
  before?: string
  arrest?: boolean
  search?: boolean
}

const TrafficStopsMap = ({ classes }) => {
  const [ search, setSearch ] = useState(false)
  const [ arrest, setArrest ] = useState(false)
  const [ searchCategory, setSearchCategory ] = useState('')
  const [ before, setBefore ] = useState('')
  const [ after, setAfter ] = useState(getLastWeek(new Date))
  const [ feedback, setFeedback ] = useState('')

  const [
    variables, setVariables
  ]: [ TrafficStopVariables, Function ] = useState({ after: getLastWeek(new Date) })

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
            name='trafficStops'
            query={getStops}
            variables={variables}
            popupQuery={getStopDetails}
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
              <DetailFilters
                search={search}
                arrest={arrest}
                setSearch={() => setSearch(!search)}
                setArrest={() => setArrest(!arrest)}
              />
              { search &&
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="search-category">Type of search</InputLabel>
                  <Select
                    value={searchCategory}
                    onChange={e => setSearchCategory(e.target.value)}
                    inputProps={{
                      name: 'searchType',
                      id: 'search-category',
                    }}
                  >
                    <MenuItem value={'Probable cause'}>Probable cause</MenuItem>
                    <MenuItem value={'Consented to search'}>Consented to search</MenuItem>
                  </Select>
                </FormControl>
              }
              <IconButton
                className={classes.iconButton}
                onClick={e => {
                  e.preventDefault()
                  setFeedback('')

                  // we only want to query fields we've used
                  setVariables({
                    ...before && { before },
                    ...after && { after },
                    ...search && { search },
                    ...arrest && { arrest },
                    ...searchCategory && { searchCategory },
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

export default withStyles(styles)(TrafficStopsMap)
