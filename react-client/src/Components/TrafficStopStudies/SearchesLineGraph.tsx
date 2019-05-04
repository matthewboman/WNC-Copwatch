import React from 'react'
import { LinePath } from '@vx/shape'

import { x, y, partialXScale, partialYScale } from '../../utils/d3Helpers'

interface Dimensions {
  width: number,
  height: number
}

// TODO: update names
export default (dimensions: Dimensions, stats: any[]) => {
  const searches = stats.map(v => ({ date: v.date, value: v.searches }))
  const driver_searched = stats.map(v => ({ date: v.date, value: v.driver_searched }))
  const passenger_searched = stats.map(v => ({ date: v.date, value: v.passenger_searched }))
  const personal_effects_searched = stats.map(v => ({ date: v.date, value: v.personal_effects_searched }))
  const vehicle_searched = stats.map(v => ({ date: v.date, value: v.vehicle_searched }))

  const xScale = partialXScale(dimensions.width)(searches)
  const yScale = partialYScale(dimensions.height)(searches)

  return (
    <svg width={dimensions.width} height={dimensions.height}>
      <rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill="#242424" rx={14} />
      <LinePath
        data={searches}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={driver_searched}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={passenger_searched}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={personal_effects_searched}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
      <LinePath
        data={vehicle_searched}
        x={d => xScale(x(d))}
        y={d => yScale(y(d))}
        stroke={'#F2A2D2'}
        strokeWidth={1}
      />
    </svg>
  )
}
