/**
 * D3 helper functions shared btw components
 */
import { scaleTime, scaleLinear } from '@vx/scale'
import { extent, max } from 'd3-array'

// Accessors
export const x = d => new Date(d.date)
export const y = d => d.value

// Scales
export const partialXScale = (width: number) => data => scaleTime({
  range: [0, width],
  domain: extent(data, x)
})
export const partialYScale = (height: number) => data => scaleLinear({
  range: [height, 0],
  domain: [0, max(data, y)]
})
