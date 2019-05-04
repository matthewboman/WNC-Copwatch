import React from 'react'
import { LinePath } from '@vx/shape'

import { x, y, partialXScale, partialYScale } from '../../utils/d3Helpers'

interface Dimensions {
  width: number,
  height: number
}

// TODO: update names
export default (dimensions: Dimensions, stats: any[]) => {
  const arrests = stats.map(v => ({ date: v.date, value: v.arrests }))
  const driver_arrested = stats.map(v => ({ date: v.date, value: v.driver_arrested }))
  const passenger_arrested = stats.map(v => ({ date: v.date, value: v.passenger_arrested }))

  const xScale = partialXScale(dimensions.width)(arrests)
  const yScale = partialYScale(dimensions.height)(arrests)

  return (
    <svg width={dimensions.width} height={dimensions.height}>
      <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill="#242424" rx={14} />
      <LinePath
        data={arrests}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={driver_arrested}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={passenger_arrested}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
    </svg>
  )
}
