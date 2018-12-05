<template>
  <div class="chart-container">
    <h2 class="title">Traffic Stops Leading to Arrests Since October 2017</h2>


    <div class="row">
      <div class="col col-md-2 offset-md-1 legend">
        <div class="key">
          <span class="value">{{ driverArrestedText }}</span>
          <span class="bg-color bg-light-blue"></span>
        </div>
        <div class="key">
          <span class="value">{{ passenderArrestedText }}</span>
          <span class="bg-color bg-light-green"></span>
        </div>
      </div>

      <div class="col col-md-8">
        <svg id="arrest"></svg>
      </div>
    </div>

  </div>
</template>

<script>
  import * as d3 from 'd3'
  import { formatTrafficStops } from '../../utils/functions'
  import { charts, fns } from '../../utils'

  let padding = 30
  let thisTypeDataset = []

  const toggleBackButton = () => {
    const backButton = d3.select("#arrestBackButton")
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
    props: ['isMobile'],

    data() {
      return {
        keys: [
          'driver_arrested',
          'passenger_arrested',
        ],
        h: 500,
        w: 1200,
        xScale: null,
        yScale: null,
        yAxis: null,
        svg: null,
        area: null,
        currentDataset: [],
        driverArrestedText: "Driver arrested",
        passenderArrestedText: "Passenger arrested"
      }
    },

    created() {
      this.$store.watch(
        state => this.$store.state.traffic_reports.formattedTrafficReports,
        (current, previous) => {
          this.renderGraph(current, this.keys)
        }
      )
    },

    mounted() {
      this.createSVG()
    },

    beforeDestroy() {
      this.xScale = null
      this.yScale = null
      this.yAxis = null
      this.svg = null
      this.area = null
      this.currentDataset = []
    },

    methods: {
      createSVG() {
        if (this.isMobile) {
          this.w = fns.scaleWidth(40)
          this.h = fns.scaleWidth(40)
        }
        this.svg = d3.select('#arrest')
          .attr('width', this.w)
          .attr('height', this.h)
      },
      renderGraph(dataset, keys) {
        // avoid `this` if we can b/c it gets messy w/ vue/d3
        const component = this

        /**
         * Scale initial data, create axis-rendering functions
         */
        component.xScale = charts.createXScale(dataset, padding, this.w)
        component.yScale = charts.createYScaleArea(dataset, keys, padding, this.h)

        const t = this.isMobile ? charts.formatMobileTime : charts.formatTime
        const xAxis = charts.createXTimeAxis(component.xScale, 10, t)
        component.yAxis = charts.createYAxis(component.yScale, 10)

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
                  .call(component.yAxis)
              })
              .duration(1000)
              .attr("d", component.area)
              .transition()
              .on("start", () => {
                d3.selectAll("g#arrests path")
                  .attr("opacity", 0)
              })
              .duration(1000)
              .attr("opacity", 1)
              .on("end", (d, i) => {
                if (i == 0) {
                  toggleBackButton()
                }
              })

            paths.append("title")
              .text(d => this.textMapper(d.key))
          })
          .append("title")
          .text(d => this.textMapper(d.key))

          /*
           * Attach axes && back button
           */
          component.svg.append("g")
            .attr("class", "axis x")
            .attr("transform", `translate(0,${this.h - padding})`)
            .call(xAxis)

          component.svg.append("g")
            .attr("class", "axis y arrests")
            .attr("transform", `translate(${padding}, 0)`)
            .call(component.yAxis)

          const backButton = component.svg.append("g")
            .attr("id", "arrestBackButton")
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
                d3.select("g.axis.y.arrests")
                  .transition()
                  .duration(1000)
                  .call(component.yAxis)
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
      textMapper(name) {
        switch (name) {
          case 'driver_arrested':
            return this.driverArrestedText
          case 'passenger_arrested':
            return this.passenderArrestedText
        }
      }

    }

  }
</script>

<style>

  /**
   * style SVGs
   */
  #arrestBackButton {
		cursor: pointer;
	}

	#arrestBackButton rect {
		fill: #ccc;
	}

	#arrestBackButton text {
		font-family: Helvetica, sans-serif;
		font-weight: bold;
		font-size: 14px;
		fill: black;
	}

</style>
