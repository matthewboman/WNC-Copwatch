import React from 'react'
import HeatmapLayer from 'react-leaflet-heatmap-layer'

export default (props) => {
  console.log(props)
  return (

    <HeatmapLayer
      points={props.points}
      fitBoundsOnLoad={false}
      fitBoundsOnUpdate={false}
      longitudeExtractor={m => m[1]}
      latitudeExtractor={m => m[0]}
      intensityExtractor={m => parseFloat(m[2])} />
  )
}
