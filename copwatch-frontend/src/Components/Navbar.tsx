import React, { Component } from 'react'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import {
  APDLink,
  Home,
  HouselessStudiesLink,
  OfficerLink,
  RaceStudiesLink,
  TrafficLink,
  TrafficStudiesLink,
} from './links'

export default class Navbar extends Component {
  state = {
    anchorEl: null
  }

  handleClick = (e: any) => {
    this.setState({ anchorEl: e.currentTarget })
  }

  handleClose = (e: any) => {
    this.setState({ anchorEl: null })
  }

  render() {
    const { anchorEl } = this.state

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Menu"
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose} component={Home}>
              Home
            </MenuItem>
            <MenuItem onClick={this.handleClose} component={APDLink}>
              APD Bulletins
            </MenuItem>
            <MenuItem onClick={this.handleClose} component={TrafficLink}>
              Traffic Stops
            </MenuItem>
            <MenuItem onClick={this.handleClose} component={TrafficStudiesLink}>
              Traffic Stop Studies
            </MenuItem>
            <MenuItem onClick={this.handleClose} component={HouselessStudiesLink}>
              Houseless Studies
            </MenuItem>
            <MenuItem onClick={this.handleClose} component={RaceStudiesLink}>
              Race Studies
            </MenuItem>
            <MenuItem onClick={this.handleClose} component={OfficerLink}>
              Officer Information
            </MenuItem>
          </Menu>
          <Typography variant="h6" color="inherit">
            AVL Community Action
          </Typography>
        </Toolbar>
      </AppBar>
    )
  }
}
