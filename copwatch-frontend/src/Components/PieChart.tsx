import React from 'react'
import { Pie } from '@vx/shape'
import { Group } from '@vx/group'
// import { GradientPinkBlue } from '@vx/gradient'
import { letterFrequency } from '@vx/mock-data'

const black = '#000000';

const letters = letterFrequency.slice(0, 4);
const frequency = d => d.frequency;
const value = d => d.value

export default ({ width, height, stats }) => {

  const radius = Math.min(width, height) / 2;
  const centerY = height / 2;
  const centerX = width / 2;

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
      <Pie
          data={stats}
          pieValue={value}
          pieSortValues={(a, b) => -1}
          outerRadius={radius - 135}
        >
        {pie => {
          return pie.arcs.map((arc, i) => {
            const opacity = 1 / (i + 2);
            const [centroidX, centroidY] = pie.path.centroid(arc);
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
            );
          });
        }}
      </Pie>
      </Group>
    </svg>
  )
}
