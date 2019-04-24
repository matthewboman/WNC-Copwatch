import React, { Component } from 'react'
import { Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { StyleRulesCallback, Theme, withStyles, createStyles } from '@material-ui/core/styles'

interface StyledFilter {
  classes: any,
  updateQuery: Function
}

class MapFilters extends Component<StyledFilter> {
  state = {
    after: "",
    before: ""
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value })
  }

  updateQuery = () => {
    this.props.updateQuery(this.state)
  }

  render() {
    const { after, before } = this.state
    const { classes } = this.props

    return (
      <form className={classes.container} noValidate>
        <TextField
          id="date"
          label="after"
          type="date"
          defaultValue={after}
          className={classes.textField}
          onChange={this.handleChange('after')}
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
          onChange={this.handleChange('before')}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <IconButton
          className={classes.iconButton}
          onClick={this.updateQuery}
          aria-label="Search"
        >
          <Search />
        </IconButton>
      </form>
    )
  }
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

export default withStyles(styles)(MapFilters)
