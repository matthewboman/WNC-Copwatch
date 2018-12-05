<template>
  <div class="chart-container">
    <h2 class="title">Traffic Stops Leading to Searches Since October 2017</h2>

    <div class="row">
      <div class="col col-md-2 offset-md-1 legend">
        <div class="key">
          <span class="value">{{ driverSeachedText }}</span>
          <span class="bg-color bg-purple"></span>
        </div>
        <div class="key">
          <span class="value">{{ passenderSearchedText }}</span>
          <span class="bg-color bg-violet"></span>
        </div>
        <div class="key">
          <span class="value">{{ searchInitiatedText }}</span>
          <span class="bg-color bg-light-blue"></span>
        </div>
        <div class="key">
          <span class="value">{{ vehicleSearchedText }}</span>
          <span class="bg-color bg-seafoam"></span>
        </div>
        <div class="key">
          <span class="value">{{ personalEffectsSearchedText }}</span>
          <span class="bg-color bg-light-green"></span>
        </div>
        <div class="key">
          <span class="value">{{ consentText }}</span>
          <span class="bg-color bg-green-yellow"></span>
        </div>
        <div class="key">
          <span class="value">{{ warrantText }}</span>
          <span class="bg-color bg-yellow-green"></span>
        </div>
      </div>

      <div class="col col-md-8">
        <svg id="search" ></svg>
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
    const backButton = d3.select("#searchBackButton")
    const hidden = backButton.classed("unclickable")

    if (hidden) {
      backButton.classed("unclickable", false)
        .transition()
        .duration(200)
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
          'driver_searched',
          'passenger_searched',
          'search_initiated',
          'vehicle_searched',
          'personal_effects_searched',
          't_search_consent',
          't_search_warrant'
        ],
        xScale: null,
        yScale: null,
        yAxis: null,
        svg: null,
        area: null,
        h: 500,
        w: 1200,
        currentDataset: [],
        driverSeachedText: "Driver searched",
        passenderSearchedText: "Passenger searched",
        searchInitiatedText: "Search initiated",
        vehicleSearchedText: "Vehicle searched",
        personalEffectsSearchedText: "Personal effects searched",
        consentText: "Individual consented to search",
        warrantText: "Search conducted with warrant"
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
        this.svg = d3.select('#search')
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
          .attr("id", "searches")
          .selectAll('path')
          .data(series)
          .enter()
          .append('path')
          .attr('class', "area")
          .attr('d', component.area)
          .attr('fill', (d, i) => component.searchColors(d, i))
          .on("click", function(d) {
            const thisType = d.key

            /**
             * Create dataset and series for selected type
             */
            component.currentDataset = dataset.map(d => ({
              date: d.date,
              'driver_searched': 0,
              'passenger_searched': 0,
              'search_initiated': 0,
              'vehicle_searched': 0,
              'personal_effects_searched': 0,
              't_search_consent': 0,
              't_search_warrant': 0,
              [thisType]: d[thisType]
            }))

            const thisTypeSeries = stack(component.currentDataset)

            /**
             * Update the graph
             */
            const paths = d3.selectAll("g#searches path")
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
                d3.select("g.axis.y.searches")
                  .transition()
                  .duration(1000)
                  .call(component.yAxis)
              })
              .duration(1000)
              .attr("d", component.area)
              .transition()
              .on("start", () => {
                d3.selectAll("g#searches path")
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
            .attr("class", "axis y searches")
            .attr("transform", `translate(${padding}, 0)`)
            .call(component.yAxis)

          const backButton = component.svg.append("g")
            .attr("id", "searchBackButton")
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

            const paths = d3.selectAll("g#searches path")
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
                d3.select("g.axis.y.searches")
                  .transition()
                  .duration(1000)
                  .call(component.yAxis)
              })
              .duration(1000)
              .attr("d", component.area)
              .on("end", () => {

              })
          })
      },
      searchColors(d, i) {
        const spread = 0.2
        let startingPoint

        switch (d.key) {
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
      },
      textMapper(name) {
        switch (name) {
          case 'driver_searched':
            return this.driverSeachedText
          case 'passenger_searched':
            return this.passenderSearchedText
          case 'search_initiated':
            return this.searchInitiatedText
          case 'vehicle_searched':
            return this.vehicleSearchedText
          case 'personal_effects_searched':
            return this.personalEffectsSearchedText
          case 't_search_consent':
            return this.consentText
          case 't_search_warrant':
            return this.warrantText
        }
      }

    }

  }
</script>

<style>

  /**
   * Style SVGs
   */
  #searchBackButton {
		cursor: pointer;
	}

	#searchBackButton rect {
		fill: #ccc;
	}

	#searchBackButton text {
		font-family: Helvetica, sans-serif;
		font-weight: bold;
		font-size: 14px;
		fill: #666;
	}

</style>
