import React from 'react'
import { Query } from 'react-apollo'
import HeatmapLayer from 'react-leaflet-heatmap-layer'

import { getTargettedBulletins } from '../../utils/queries'
import { withinShape } from '../../utils/functions'

const withinAVL = withinShape([
  [35.818704,-83.078686],
  [35.800885,-82.123296],
  [35.237543,-82.068389],
  [35.264459,-82.793167],
])

const variables = { target: "houseless" }

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

      return <HeatmapLayer
              points={points}
              fitBoundsOnLoad={false}
              fitBoundsOnUpdate={false}
              latitudeExtractor={m => m[0]}
              longitudeExtractor={m => m[1]}
              intensityExtractor={m => parseFloat(m[2])}
            />
    }}
  </Query>
)
