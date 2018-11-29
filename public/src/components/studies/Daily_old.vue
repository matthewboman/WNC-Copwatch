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
  import { categoryPerDay, formatDataset } from '../../vuex/functions'

  let svg, area, xScale, yScale;
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
        state => this.$store.state.traffic_reports.allOpenDataReports,
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
        const arrestStack = d3.stack()
        const searchStack = d3.stack()
        const stops = formatDataset(reports, 'stops')
        const searches = this.filterSearches(reports)
        const arrests = this.filterArrests(reports)
        const formattedSearches = formatDataset(searches, 'searches')
        const formattedArrests = formatDataset(arrests, 'arrests')

        xScale = d3.scaleTime()
          .domain([
            d3.min(stops, d => d.date),
            d3.max(stops, d => d.date)
          ])
          .range([padding, w])
          // .range([padding, w - padding * 2])
        yScale = d3.scaleLinear()
          .domain([
            d3.min(stops, d => d.category),
            d3.max(stops, d => d.category)
          ])
          .range([h - padding, padding])
          // .range([h - padding, padding])

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
          .attr("transform", `translate(0,${(h - padding)})`)
          .call(xAxis)

        svg.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(${padding}, 0)`)
          .call(yAxis)

        area = d3.area()
          .x(d => xScale(d.date))
          .y0(d => yScale(0))
          .y1(d => yScale(d.category))

        svg.append('path')
          .datum(stops)
          .attr('class', 'traffic-stops')
          .attr('d', area)

        svg.append('path')
          .datum(formattedSearches)
          .attr('class', 'searches')
          .attr('d', area)
          .on('click', function() {
            const driver_searched = formatDataset(
              searches.filter(d => d.driver_searched == 1),
              'driver_searched'
            )
            const passenger_searched = formatDataset(
              searches.filter(d => d.passenger_searched == 1),
              'passenger_searched'
            )
            const personal_effects_searched = formatDataset(
              searches.filter(d => d.personal_effects_searched == 1),
              'personal_effects_searched'
            )
            const vehicle_searched = formatDataset(
              searches.filter(d => d.vehicle_searched == 1),
              'vehicle_searched'
            )
            const keys = ['driver_searched', 'passenger_searched', 'personal_effects_searched', 'vehicle_searched']
            searchStack.keys(keys)
            const dataset = [...driver_searched, ...passenger_searched, personal_effects_searched, vehicle_searched]
            const series = searchStack(dataset)

            const paths = d3.selectAll('#types path')
              .data(series)
              .classed('unclickable', 'true')
            const areaTransitions = paths.transition()
              .duration(1000)
              .attr('d', area)

            areaTransitions.transition()
              .on('start', function() {

              })
              .duration(1000)
              .attr('d', area)
              .transition()
              .on('start', function() {

              })
              .duration(1000)
              .attr('opacity', 0)

            area = d3.area()
              .x(d => xScale(d.date))
              .y0(d => yScale(d[0]))
              .y1(d => yScale(d[1]))

            svg.append('g')
              .attr('id', 'searches')

            svg.append('g')
              .attr('id', 'search-details')
              .selectAll('path')
              .data(series)
              .enter()
              .append('path')
              .attr('class', 'area')
              .attr('opacity', 1)
              .attr('d', area)
              // .attr('fill')

          })
        svg.append('path')
          .datum(formattedArrests)
          .attr('class', 'arrests')
          .attr('d', area)

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
