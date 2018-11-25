const d3 = require('d3')

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

// createXScale :: Array -> Array -> Int -> Int -> Function
const createYScale = (dataset, keys, padding, height) => {
  return d3.scaleLinear()
    .domain([
      0,
      d3.max(dataset, d => keys.reduce((acc, key) => acc += d[key], 0))
    ])
    .range([height - padding, padding])
}

module.exports = {
  createYAxis,
  createXScale,
  createXTimeAxis,
  createYScale,
}
