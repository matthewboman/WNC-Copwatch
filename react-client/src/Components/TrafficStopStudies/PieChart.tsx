import React from 'react'
import { Pie } from '@vx/shape'
import { Group } from '@vx/group'

const black = '#000000'
const value = d => d.value

const PieChart = ({ dimensions, stats }) => {
  const radius = Math.min(dimensions.width, dimensions.height) / 2
  const centerY = dimensions.height / 2
  const centerX = dimensions.width / 2

  return (
    <svg width={dimensions.width} height={dimensions.height}>
      <Group top={centerY} left={centerX}>
        <Pie
          data={stats}
          pieValue={value}
          pieSortValues={(a, b) => -1}
          outerRadius={radius - 135}
        >
          {pie => {
            return pie.arcs.map((arc, i) => {
              const opacity = 1 / (i + 2)
              const [centroidX, centroidY] = pie.path.centroid(arc)
              return (
                <g key={`letters-${arc.data.label}-${i}`}>
                  <path d={pie.path(arc)} fill={black} fillOpacity={opacity} />
                  <text
                    fill="white"
                    textAnchor="middle"
                    x={centroidX}
                    y={centroidY}
                    dy=".33em"
                    fontSize={9}
                  >
                    {arc.data.key}
                  </text>
                </g>
              )
            })
          }}
        </Pie>
      </Group>
    </svg>
  )
}

export default React.memo(PieChart)
