import React, { useState } from 'react'
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

import {
  APDBulletinMapLink,
  Home,
  HouselessStudiesLink,
  OfficerLink,
  RaceStudiesLink,
  TrafficStopMapLink,
  TrafficStopStudiesLink,
} from '../links'

export default props => {
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Menu"
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)} component={Home}>
            Home
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} component={APDBulletinMapLink}>
            APD Bulletins
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} component={TrafficStopMapLink}>
            Traffic Stops
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} component={TrafficStopStudiesLink}>
            Traffic Stop Studies
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} component={HouselessStudiesLink}>
            Houseless Studies
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} component={RaceStudiesLink}>
            Race Studies
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)} component={OfficerLink}>
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
