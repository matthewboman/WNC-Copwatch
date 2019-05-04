import React from 'react'
import { LinePath } from '@vx/shape'

import { x, y, partialXScale, partialYScale } from '../../utils/d3Helpers'

interface Dimensions {
  width: number,
  height: number
}

// TODO: update names
export default (dimensions: Dimensions, stats: any[]) => {
  const stops = stats.map(v => ({ date: v.date, value: v.stops }))
  const searches = stats.map(v => ({ date: v.date, value: v.searches }))
  const arrests = stats.map(v => ({ date: v.date, value: v.arrests }))

  const xScale = partialXScale(dimensions.width)(stops)
  const yScale = partialYScale(dimensions.height)(stops)

  return (
    <svg width={dimensions.width} height={dimensions.height}>
      <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill="#242424" rx={14} />
      <LinePath
        data={stops}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#A2CAF2'}
        strokeWidth={1}
      />
      <LinePath
        data={arrests}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#BEF2A2'}
        strokeWidth={1}
      />
      <LinePath
        data={searches}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
  </svg>
  )
}
