const d3 = require('d3')

// createArc :: Int -> Int -> Function
const createArc = (inner, outer) =>
  d3.arc().innerRadius(inner).outerRadius(outer)

// createXTimeAxis :: Function -> Int -> Function -> Function
const createXTimeAxis = (scale, ticks, format) =>
  d3.axisBottom().scale(scale).ticks(ticks).tickFormat(format)

// createYAxis :: Function -> Int -> Function
const createYAxis = (scale, ticks) =>
  d3.axisLeft().scale(scale).ticks(ticks)

// createXScale :: Array -> Int -> Int -> Function
const createXScale = (dataset, padding, width) => {
  return d3.scaleTime()
    .domain([
      d3.min(dataset, d => new Date(d.date)),
      d3.max(dataset, d => new Date(d.date))
    ])
    .range([padding, width])
}

// createYScaleArea :: Array -> Array -> Int -> Int -> Function
const createYScaleArea = (dataset, keys, padding, height) => {
  return d3.scaleLinear()
    .domain([
      0,
      d3.max(dataset, d => keys.reduce((acc, key) => acc += d[key], 0))
    ])
    .range([height - padding, padding])
}

// createYScaleLine :: Array -> Int -> Int -> Function
const createYScaleLine = (dataset, padding, height) => {
  return d3.scaleLinear()
    .domain([
      0,
      d3.max(dataset, d => d.category)
    ])
    .range([height - padding, padding])
}

// formatTime :: Function
const formatTime = d3.timeFormat("%B %Y")

// formatMobileTime :: Function
const formatMobileTime = d3.timeFormat("%b")

module.exports = {
  createArc,
  createYAxis,
  createXScale,
  createXTimeAxis,
  createYScaleArea,
  createYScaleLine,
  formatTime,
  formatMobileTime
}
