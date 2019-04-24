import React from 'react'
import { LayersControl, Map, TileLayer, Marker, Popup } from 'react-leaflet'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { Query } from 'react-apollo'

import PopupQuery from './PopupQuery'
// import HeatLayer from './HeatLayer'

type LatLngExpression = [number, number]

const DEFAULT_CENTER: LatLngExpression = [35.575058, -82.551487]
const BASEMAP = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
const ZOOM = 8

const styles: StyleRulesCallback = (theme: Theme) => ({
  wrapper: {
    height: "500px"
  },
})

const withinShape = (bounds: any) => (point: number[]) => {
  const x = point[0]
  const y = point[1]
  let inside = false

  for (let i = 0, j = bounds.length - 1; i < bounds.length; j = i++) {
      let xi = bounds[i][0], yi = bounds[i][1];
      let xj = bounds[j][0], yj = bounds[j][1];

      let intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  return inside
}

const withinAVL = withinShape([
  [35.818704,-83.078686],
  [35.800885,-82.123296],
  [35.237543,-82.068389],
  [35.264459,-82.793167],
])

const MapContainer = ({ classes, query, variables, popupQuery }) => (
  <Grid container spacing={24}>
    <Grid item xs={12}>
      <Map center={DEFAULT_CENTER} zoom={ZOOM}>
        <LayersControl>
          <LayersControl.BaseLayer name="Base" checked>
            <TileLayer
              attribution={ATTRIBUTION}
              url={BASEMAP}
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Details" checked>
            <Query query={query} variables={variables}>
              {({ data, loading, error }) => {
                if (!data) return null
                if (loading) return <span>loading</span>
                if (error) <span>error</span>

                if (
                  query.definitions[0].name.value == 'apd_bulletins' ||
                  query.definitions[0].name.value == 'trafficStops'
                ) {
                  const markers = data.trafficStops
                    ? data.trafficStops
                    : data.apd_bulletins
                  return Markers(markers, popupQuery)
                }

                if (query.definitions[0].name.value == 'targetedAPDBulletins') {
                  const points = data.targetedAPDBulletins
                    .filter(r => r.geometry)
                    .filter(r => withinAVL([r.geometry.lat, r.geometry.lng]) )
                    .map(r => [r.geometry.lat, r.geometry.lng, '500'])
                  return HeatLayer(points)

                }

                return <div>there was an issue with the query</div>

              }}
            </Query>
          </LayersControl.Overlay>
        </LayersControl>
      </Map>
    </Grid>
  </Grid>
)

const Markers = (markers, popupQuery) => markers
  .filter(m => m.geometry != null)
  .map(m => (
    <Marker key={m.id} position={[m.geometry.lat as number, m.geometry.lng as number]}>
      <Popup>
         <PopupQuery
           id={m.id}
           popupQuery={popupQuery}
         />
      </Popup>
    </Marker>
  ))


const HeatLayer = (points) => (
  <HeatmapLayer
    points={points}
    fitBoundsOnLoad
    fitBoundsOnUpdate
    longitudeExtractor={m => m[1]}
    latitudeExtractor={m => m[0]}
    intensityExtractor={m => parseFloat(m[2])} />
)

export default withStyles(styles)(MapContainer)
