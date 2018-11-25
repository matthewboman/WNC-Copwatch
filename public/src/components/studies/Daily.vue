<template>
  <div>
    <!-- <svg :height="h" :width="w"></svg> -->
    <svg></svg>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  import * as R from 'ramda'
  import { mapActions, mapState } from 'vuex'
  import { categoryPerDay, formatDataset, formatTrafficStops } from '../../utils/functions'

  let arrests, searches, svg, stops, xScale, yScale;
  let padding = 30
  let h = 500
  let w = 1500

  export default {
    data() {
      return {

      }
    },

    computed: {

    },

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

    updated() {

    },

    methods: {
      ...mapActions({
        getOpenDataReports: 'getOpenDataReports'
      }),
      createSVG() {
        svg = d3.select('svg')
          .attr('width', w)
          .attr('height', h)
      },
      renderGraph(reports) {
        let r = reports.slice(1, 100)
        const dataset = formatTrafficStops(reports)
        console.log(dataset)

        // scale data
        xScale = d3.scaleTime()
          .domain([
            d3.min(dataset, d => new Date(d.date)),
            d3.max(dataset, d => new Date(d.date))
          ])
          .range([padding, w])
        yScale = d3.scaleLinear()
          .domain([
            d3.min(dataset, d => d.stops),
            d3.max(dataset, d => d.stops)
          ])
          .range([h - padding, padding])

        // create axes
        const formatTime = d3.timeFormat("%B %Y")
        const xAxis = d3.axisBottom()
          .scale(xScale)
          .ticks(10)
          .tickFormat(formatTime)
        const yAxis = d3.axisLeft()
          .scale(yScale)
          .ticks(10)

        svg.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(0,${h - 20})`)
          .call(xAxis)

        svg.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(${padding}, 0)`)
          .call(yAxis)

        /*
         * All Traffic Stops
         */
        stops = d3.area()
          .x(d => xScale(new Date(d.date)))
          .y0(d => yScale(0))
          .y1(d => yScale(d.stops))

        // svg.append('path')
        //   .datum(dataset)
        //   .attr('class', 'traffic-stops')
        //   .attr('d', stops)
        //   .append('title')
        //   .text('Traffic stops')

        /*
         * Searches
         */
        searches = d3.area()
          .x(d => xScale(new Date(d.date)))
          .y0(d => yScale(0))
          .y1(d => yScale(d.searches))

        // svg.append('path')
        //   .datum(dataset)
        //   .attr('class', 'searches')
        //   .attr('d', searches)
        //   .on('click', function() {

            console.log('clicked')
            const keys = [
              'driver_searched',
              'passenger_searched',
              'search_initiated',
              'vehicle_searched',
              'personal_effects_searched',
              't_search_consent',
              't_search_warrant'
            ]

            yScale = d3.scaleLinear()
              .domain([
                0,
                d3.max(dataset, function(d) {
                  let sum = 0
                  for (let i = 0; i < keys.length; i++) {
                    // console.log(d[keys[i]])
                    sum += d[keys[i]]
                  }
                  return sum
                })
              ])
              .range([h - padding, padding])

            const area = d3.area()
              .x(d => {
                // console.log('d', d)
                // console.log('xScale(new Date(d.date))', xScale(d.date))
                return xScale(d.data.date)
              })
              .y0(d => {
                // console.log('yScale(d[0])', yScale(d[0]))
                return yScale(d[0])
              })
              .y1(d => {
                // console.log('yScale(d[1])', yScale(d[1]))
                return yScale(d[1])
              })

            const stack = d3.stack()
              .keys(keys)
            const series = stack(dataset)
            console.log(series)

            // const paths = d3.selectAll('#types path')
            //   .data(series)
            //   .classed('unclickable', true)
            //
            // const areaTransitions = paths.transition()
            //   .duration(1000)
            //   .attr('d', area)

            // yScale.domain([
            //   0,
            //   d3.max(d => {
            //     let sum = 0
            //     sum += d.searches
            //     return sum
            //   })
            // ])

            // areaTransitions.transition()
            //   .delay(200)
            //   .on('start', function() {
            //     d3.select('g.axis.y')
            //     .transition()
            //     .duration(1000)
            //     .call(yAxis)
            //   })
            //   .duration(1000)
            //   .attr('d', area)
            //   .transition()
            //   .on('start', function() {
            //
            //   })
            //   .duration(1000)


            svg.selectAll('path')
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
                // return d3.schemeCategory10[i]
              })
              .append("title")
              .text(d => d.key)
          // })
          // .append('title')
          // .text('Searches')

        /*
         * Arrests
         */
        // arrests = d3.area()
        //   .x(d => xScale(new Date(d.date)))
        //   .y0(d => yScale(0))
        //   .y1(d => yScale(d.arrests))
        //
        // svg.append('path')
        //   .datum(dataset)
        //   .attr('class', 'arrests')
        //   .attr('d', arrests)
        //   .append('title')
        //   .text('Arrests')
      },
      filterSearches(array) {
        return array.filter(d => (
          d.driver_searched == 1 ||
          d.passenger_searched == 1 ||
          d.personal_effects_searched == 1 ||
          d.search_initiated == 1 ||
          d.vehicle_searched == 1
        ))
      },
      filterArrests(array) {
        return array.filter(d => (
          d.driver_arrested == 1 ||
          d.passenger_arrested == 1
        ))
      }
    }

  }
</script>

<style>

  .traffic-stops {
    fill: teal;
  }

  .searches {
    fill: yellow;
    opacity: 0.5;
  }

  .arrests {
    fill: red;
    opacity: 0.5;
  }

</style>
