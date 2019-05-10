import React from 'react'
import { LayersControl, Map, TileLayer } from 'react-leaflet'
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

type LatLngExpression = [number, number]

const DEFAULT_CENTER: LatLngExpression = [35.575058, -82.551487]
const BASEMAP = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
const ZOOM = 8

// const MapContainer = ({ classes, children }) => (
//   <Grid container spacing={24}>
//     <Grid item xs={12}>
//       <Map center={DEFAULT_CENTER} zoom={ZOOM}>
//         <LayersControl>
//           <LayersControl.BaseLayer name="Base" checked>
//             <TileLayer
//               attribution={ATTRIBUTION}
//               url={BASEMAP}
//             />
//           </LayersControl.BaseLayer>
//           <LayersControl.Overlay name="Details" checked>
//             { children }
//           </LayersControl.Overlay>
//         </LayersControl>
//       </Map>
//     </Grid>
//   </Grid>
// )

const MapContainer = ({ classes, children }) => (
  <Grid container spacing={24}>
    <Grid item xs={12}>
      <Map center={DEFAULT_CENTER} zoom={ZOOM}>
        <TileLayer
          attribution={ATTRIBUTION}
          url={BASEMAP}
        />
        { children }
      </Map>
    </Grid>
  </Grid>
)

const styles: StyleRulesCallback = (theme: Theme) => ({
  wrapper: {
    height: "500px"
  },
})

export default withStyles(styles)(MapContainer)
