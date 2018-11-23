<template>
  <div>
    <svg id="search"></svg>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  import * as R from 'ramda'
  import { mapActions, mapState } from 'vuex'
  import { categoryPerDay, formatDataset, formatTrafficStops } from '../../vuex/functions'

  let searches, svg, xScale, yScale;
  let padding = 30
  let h = 500
  let w = 1500
  let thisTypeDataset = []

  const toggleBackButton = () => {
    const backButton = d3.select("#backButton")
    const hidden = backButton.classed("unclickable")

    if (hidden) {
      backButton.classed("unclickable", false)
        .transition()
        .duration(100)
        .attr("opacity", 1)
    } else {
      backButton.classed("unclickable", true)
        .transition()
        .duration(200)
        .attr("opacity", 0)
    }
  }

  export default {

    created() {
      this.$store.watch(
        state => this.$store.state.reports.allOpenDataReports,
        (current, previous) => {
          this.renderGraph(current)
        }
      )
    },

    mounted() {
      this.createSVG()
      this.getOpenDataReports()
    },

    methods: {
      ...mapActions({
        getOpenDataReports: 'getOpenDataReports'
      }),
      createSVG() {
        svg = d3.select('#search')
          .attr('width', w)
          .attr('height', h)
      },
      renderGraph(reports) {
        const dataset = formatTrafficStops(reports)
        const keys = [
          'driver_searched',
          'passenger_searched',
          'search_initiated',
          'vehicle_searched',
          'personal_effects_searched',
          't_search_consent',
          't_search_warrant'
        ]

        /**
         * Scale initial data
         */
        xScale = d3.scaleTime()
          .domain([
            d3.min(dataset, d => new Date(d.date)),
            d3.max(dataset, d => new Date(d.date))
          ])
          .range([padding, w])
        yScale = d3.scaleLinear()
          .domain([
            0,
            d3.max(dataset, d => keys.reduce((acc, key) => acc += d[key], 0))
          ])
          .range([h - padding, padding])

        /**
         * Create axes
         */
        const formatTime = d3.timeFormat("%B %Y")
        const xAxis = d3.axisBottom()
          .scale(xScale)
          .ticks(10)
          .tickFormat(formatTime)
        const yAxis = d3.axisLeft()
          .scale(yScale)
          .ticks(10)

        /**
         * Create area, stack, and series
         */
        const area = d3.area()
          .x(d => xScale(d.data.date))
          .y0(d => yScale(d[0]))
          .y1(d => yScale(d[1]))
        const stack = d3.stack()
          .keys(keys)
        const series = stack(dataset)

        /**
         * Load initial graph
         */
        svg.append("g")
          .attr("id", "searches")
          .selectAll('path')
          .data(series)
          .enter()
          .append('path')
          .attr('class', "area")
          .attr('d', area)
          .attr('fill', (d, i) => {
            let key = d.key
            let spread = 0.2
            let startingPoint

            switch (key) {
              case 'driver_searched':
                startingPoint = 0
                break
              case 'passenger_searched':
                startingPoint = 0.1
                break
              case 'search_initiated':
                startingPoint = 0.3
                break
              case 'vehicle_searched':
                startingPoint = 0.5
                break
              case 'personal_effects_searched':
                startingPoint = 0.6
                break
              case 't_search_consent':
                startingPoint = 0.8
                break
              case 't_search_warrant':
                startingPoint = 0.9
                break
            }
            const normalized = startingPoint + ((i / 7) * spread)
            return d3.interpolateCool(normalized)
          })
          .on("click", d => {
            const thisType = d.key

            /**
             * Create dataset and series for selected type
             */
            thisTypeDataset = []

            for (let i = 0; i < dataset.length; i++) {
              thisTypeDataset[i] = {
                date: dataset[i].date,
                'driver_searched': 0,
                'passenger_searched': 0,
                'search_initiated': 0,
                'vehicle_searched': 0,
                'personal_effects_searched': 0,
                't_search_consent': 0,
                't_search_warrant': 0,
                [thisType]: dataset[i][thisType]
              }
            }

            const thisTypeSeries = stack(thisTypeDataset)

            /**
             * Update the graph
             */
            const paths = d3.selectAll("g#searches path")
              .data(thisTypeSeries, d => d.key)
              .classed("unclickable", true)

            const areaTransitions = paths.transition()
              .duration(1000)
              .attr('d', area)

            yScale.domain([
              0, d3.max(thisTypeDataset, d => d[thisType])
            ])

            areaTransitions.transition()
              .delay(200)
              .on("start", () => {
                d3.select("g.axis.y")
                  .transition()
                  .duration(1000)
                  .call(yAxis)
              })
              .duration(1000)
              .attr("d", area)
              .transition()
              .on("start", () => {
                d3.selectAll("g#searches path")
                  .attr("opacity", 1)
              })
              .duration(1000)
              .on("end", (d, i) => {
                if (i == 0) {
                  toggleBackButton()
                }
              })

            paths.append("title")
              .text(d => d.key)
          })
          .append("title")
          .text(d => d.key)

          /*
           * Attach axes && back button
           */
          svg.append("g")
            .attr("class", "axis x")
            .attr("transform", `translate(0,${h - 20})`)
            .call(xAxis)

          svg.append("g")
            .attr("class", "axis y")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis)

          const backButton = svg.append("g")
            .attr("id", "backButton")
            .attr("opacity", 0)
            .classed("unclickable", true)
            .attr("transform", `translate(${xScale.range()[0]}, ${yScale.range()[1]})`)

          backButton.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 70)
            .attr("height", 30)

          backButton.append("text")
            .attr("x", 7)
            .attr("y", 20)
            .html("&larr; Back")

          backButton.on("click", () => {
            toggleBackButton()

            const paths = d3.selectAll("g#searches path")
              .data(series, d => d.key)
              .classed("unclickable", false)

            const areaTransitions = paths.transition()
              .duration(1000)
              .attr("opacity", 1)

            yScale.domain([
              0, d3.max(dataset, d => keys.reduce((acc, key) => acc += d[key], 0))
            ])

            areaTransitions.transition()
              .delay(200)
              .on("start", () => {
                d3.select("g.axis.y")
                  .transition()
                  .duration(1000)
                  .call(yAxis)
              })
              .duration(1000)
              .attr("d", area)
              .on("end", () => {

              })
          })
      },
    }

  }
</script>

<style>

  .area {
		stroke: none;
		cursor: pointer;
	}

	.area:hover {
		fill: yellow;
	}

  #backButton {
		cursor: pointer;
	}

	#backButton rect {
		fill: #ccc;
	}

	#backButton text {
		font-family: Helvetica, sans-serif;
		font-weight: bold;
		font-size: 14px;
		fill: black;
	}

</style>
