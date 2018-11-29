<template>
  <div>
    <svg id="arrest"></svg>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  import { formatTrafficStops } from '../../utils/functions'
  import { charts } from '../../utils'

  let padding = 30
  let h = 500
  let w = 1200
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

    data() {
      return {
        keys: [
          'driver_arrested',
          'passenger_arrested',
        ],
        xScale: null,
        yScale: null,
        svg: null,
        area: null,
        currentDataset: []
      }
    },

    // TODO: this doesn't run b/c store isn't updated
    created() {
      this.$store.watch(
        state => this.$store.state.traffic_reports.allOpenDataReports,
        (current, previous) => {
          this.renderGraph(current, this.keys)
        }
      )
    },

    mounted() {
      this.createSVG()
      console.log('mounted')
      // this.renderGraph()
    },

    methods: {
      createSVG() {
        this.svg = d3.select('#arrest')
          .attr('width', w)
          .attr('height', h)
      },
      renderGraph(reports, keys) {
        console.log('rendering a')
        // avoid `this` if we can b/c it gets messy w/ vue/d3
        const component = this
        const dataset = formatTrafficStops(reports)

        /**
         * Scale initial data
         */
        component.xScale = charts.createXScale(dataset, padding, w)
        component.yScale = charts.createYScale(dataset, keys, padding, h)

        /**
         * Create axes
         */
        const formatTime = d3.timeFormat("%B %Y")
        const xAxis = charts.createXTimeAxis(component.xScale, 10, formatTime)
        const yAxis = charts.createYAxis(component.yScale, 10)

        /**
         * Create area, stack, and series
         */
        component.area = d3.area()
          .x(d => component.xScale(d.data.date))
          .y0(d => component.yScale(d[0]))
          .y1(d => component.yScale(d[1]))
        const stack = d3.stack()
          .keys(keys)
        const series = stack(dataset)

        /**
         * Load initial graph
         */
        component.svg.append("g")
          .attr("id", "arrests")
          .selectAll('path')
          .data(series)
          .enter()
          .append('path')
          .attr('class', "area")
          .attr('d', component.area)
          .attr('fill', (d, i) => component.arrestColors(d, i))
          .on("click", d => {
            const thisType = d.key

            /**
             * Create dataset and series for selected type
             */
             component.currentDataset = dataset.map(d => ({
               date: d.date,
               'driver_arrested': 0,
               'passenger_arrested': 0,
               [thisType]: d[thisType]
             }))

            const thisTypeSeries = stack(component.currentDataset)

            /**
             * Update the graph
             */
            const paths = d3.selectAll("g#arrests path")
              .data(thisTypeSeries, d => d.key)
              .classed("unclickable", true)

            const areaTransitions = paths.transition()
              .duration(1000)
              .attr('d', component.area)

            component.yScale.domain([
              0, d3.max(component.currentDataset, d => d[thisType])
            ])

            areaTransitions.transition()
              .delay(200)
              .on("start", () => {
                d3.select("g.axis.y.arrests")
                  .transition()
                  .duration(1000)
                  .call(yAxis)
              })
              .duration(1000)
              .attr("d", component.area)
              .transition()
              .on("start", () => {
                d3.selectAll("g#arrests path")
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
          component.svg.append("g")
            .attr("class", "axis x")
            .attr("transform", `translate(0,${h - padding})`)
            .call(xAxis)

          component.svg.append("g")
            .attr("class", "axis y arrests")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis)

          const backButton = component.svg.append("g")
            .attr("id", "backButton")
            .attr("opacity", 0)
            .classed("unclickable", true)
            .attr("transform", `translate(${component.xScale.range()[0]}, ${component.yScale.range()[1]})`)

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

            const paths = d3.selectAll("g#arrests path")
              .data(series, d => d.key)
              .classed("unclickable", false)

            const areaTransitions = paths.transition()
              .duration(1000)
              .attr("opacity", 1)

            component.yScale.domain([
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
              .attr("d", component.area)
              .on("end", () => {
                // do nothing
              })
          })
      },

      arrestColors(d, i) {
        const spread = 0.2
        let startingPoint

        switch (d.key) {
          case 'driver_arrested':
            startingPoint = 0.3
            break
          case 'passenger_arrested':
            startingPoint = 0.6
            break
        }
        const normalized = startingPoint + ((i / 7) * spread)
        return d3.interpolateCool(normalized)
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
