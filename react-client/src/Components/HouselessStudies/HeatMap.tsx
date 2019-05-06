import React from 'react'
import { Query } from 'react-apollo'
import HeatmapLayer from 'react-leaflet-heatmap-layer'

import { MapContainer } from '..'

import { getTargettedBulletins } from '../../utils/queries'
import { withinShape } from '../../utils/functions'

const withinAVL = withinShape([
  [35.818704,-83.078686],
  [35.800885,-82.123296],
  [35.237543,-82.068389],
  [35.264459,-82.793167],
])

const variables = { target: "houseless" }

/**
 * Unlike the map with MarkersLayer, we return the entire map from inside the query for two reasons.
 * 1. If the TileLayer's basemap isn't rendered, `react-leaflet-heatmap-layer` will
 *    throw an error that the parent element is not defined.
 * 2. We don't need to. What is rendered depends on the query and won't be updated.
 */
export default () => (
  <Query query={getTargettedBulletins} variables={variables}>
    {({ data, loading, error }) => {
      if (!data) return null
      if (loading) return <span>loading</span>
      if (error) return <span>error</span>

      const points = data.targetedAPDBulletins
        .filter(r => r.geometry)
        .filter(r => withinAVL([r.geometry.lat, r.geometry.lng]) )
        .map(r => [r.geometry.lat, r.geometry.lng, '500'])

      return (

        <MapContainer>
          <HeatmapLayer
            points={points}
            fitBoundsOnLoad={false}
            fitBoundsOnUpdate={false}
            latitudeExtractor={m => m[0]}
            longitudeExtractor={m => m[1]}
            intensityExtractor={m => parseFloat(m[2])}
          />
        </MapContainer>
      )
    }}
  </Query>
)
