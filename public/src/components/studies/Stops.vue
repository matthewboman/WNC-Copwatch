<template>
  <div class="chart-container">
    <h2 class="title">Daily Traffic Stops Since October 2017</h2>

    <div class="row">
      <div class="col col-md-2 offset-md-1 legend">
        <div class="key">
          <span class="value">Stops per day</span>
          <span class="bg-color bg-purple"></span>
        </div>
        <div class="key">
          <span class="value">Arrests per day</span>
          <span class="bg-color bg-light-blue"></span>
        </div>
        <div class="key">
          <span class="value">Searches per day</span>
          <span class="bg-color bg-seafoam"></span>
        </div>
        <button class="btn btn-main" v-on:click="toggleGraphs()">Toggle graphs</button>
      </div>

      <div class="col col-md-8">
        <svg id="all-stops" ></svg>
      </div>
    </div>

  </div>
</template>

<script>
  import * as d3 from 'd3'
  import { mapActions, mapState } from 'vuex'
  import { charts, fns } from '../../utils'

  export default {
    props: ['isMobile'],

    data() {
      return {
        svg: null,
        xScale: null,
        yScale: null,
        padding: 30,
        h: 500,
        w: 1200,
        stops: [],
        searches: [],
        arrests: [],
        displayLineGraph: true
      }
    },

    mounted() {
      this.createSVG()
    },

    created() {
      this.$store.watch(
        state => this.$store.state.traffic_reports.formattedTrafficReports,
        (current, previous) => {
          this.renderGraph(current)
        }
      )
    },

    beforeDestroy() {
      this.stops = []
      this.searches = []
      this.arrests = []
      this.svg = null
      this.xScale = null
      this.yScale = null
    },

    methods: {
      createSVG() {
        if (this.isMobile) {
          this.w = fns.scaleWidth(40)
          this.h = fns.scaleWidth(40)
        }
        this.svg = d3.select("#all-stops")
          .attr('width', this.w)
          .attr('height', this.h)
      },
      renderGraph(reports) {
        reports.forEach(report => {
          this.stops.push({ date: report.date, category: report.stops })
          this.searches.push({ date: report.date, category: report.searches })
          this.arrests.push({ date: report.date, category: report.arrests })
        })

        /**
         * Scale chart according to total stops, create axis-rendering functions
         */
        this.xScale = charts.createXScale(this.stops, this.padding, this.w)
        this.yScale = charts.createYScaleLine(this.stops, this.padding, this.h)

        const t = this.isMobile ? charts.formatMobileTime : charts.formatTime
        const xAxis = charts.createXTimeAxis(this.xScale, 10, t)
        const yAxis = charts.createYAxis(this.yScale, 10)

        /**
         * Render chart
         */
        if (this.displayLineGraph) {
          this.renderLineGraph(this.stops, this.searches, this.arrests)
        } else {
          this.renderScatterPlot(this.stops, this.searches, this.arrests)
        }

        this.svg.append("g")
          .attr("class", "axis x")
          .attr("transform", `translate(0,${this.h - this.padding})`)
          .call(xAxis)

        this.svg.append("g")
          .attr("class", "axis y stops")
          .attr("transform", `translate(${this.padding}, 0)`)
          .call(yAxis)
      },
      renderLineGraph(stops, searches, arrests) {
        const line = d3.line()
          .x(d => this.xScale(d.date))
          .y(d => this.yScale(d.category))

        this.svg.append("path")
          .datum(stops)
          .attr("class", 'line stops')
          .attr("d", line)
          .append("title")
          .text("Traffic stops")

        this.svg.append("path")
          .datum(searches)
          .attr("class", 'line searches')
          .attr("d", line)
          .append("title")
          .text("Searches")

        this.svg.append("path")
          .datum(arrests)
          .attr("class", 'line arrests')
          .attr("d", line)
          .append("title")
          .text("Arrests")
      },
      renderScatterPlot(stops, searches, arrests) {
        const any = arr => arr.filter(i => i.category > 0) // filter out 0 values

        this.svg.selectAll("#stops")
          .data(stops)
          .enter()
          .append("circle")
          .attr("cx", d => this.xScale(d.date))
          .attr("cy", d => this.yScale(d.category))
          .attr("r", 3)
          .attr("fill", "rgb(110, 64, 170)")
          .attr('id', 'stops')
          .append('title')
          .text(d => `${d.category} stops on ${d.date}`)

        this.svg.selectAll("#arrests")
          .data(any(arrests))
          .enter()
          .append("circle")
          .attr("cx", d => this.xScale(d.date))
          .attr("cy", d => this.yScale(d.category))
          .attr("r", 3)
          .attr("fill", "rgb(43, 158, 222)")
          .attr('id', 'arrests')
          .append('title')
          .text(d => `${d.category} arrests on ${d.date}`)

        this.svg.selectAll("#searches")
          .data(any(searches))
          .enter()
          .append("circle")
          .attr("cx", d => this.xScale(d.date))
          .attr("cy", d => this.yScale(d.category))
          .attr("r", 3)
          .attr("fill", "rgb(28, 220, 168)")
          .attr('id', 'searches')
          .append('title')
          .text(d => `${d.category} searches on ${d.date}`)
      },
      toggleGraphs() {
        if (this.displayLineGraph) {
          this.displayLineGraph = false

          this.svg.selectAll("path")
            .transition()
            .on('start', () => {
              this.svg.selectAll("path").attr('opacity', 1)
            })
            .duration(500)
            .attr('opacity', 0)
            .on('end', () => {
              this.svg.selectAll("path").remove()
            })

          this.renderScatterPlot(this.stops, this.searches, this.arrests)
        } else {
          this.displayLineGraph = true

          this.svg.selectAll("circle")
            .transition()
            .on('start', () => {
              this.svg.selectAll('circle').attr('opacity', 1)
            })
            .duration(500)
            .attr('opacity', 0)
            .on('end', () => {
              this.svg.selectAll("circle").remove()
            })

          this.renderLineGraph(this.stops, this.searches, this.arrests)
        }
      }

    }
  }
</script>

<!-- we can't use scss or scope the style -->
<style>
  /* style svgs */
  .line {
    cursor: pointer;
  }
  circle {
    cursor: pointer;
  }
  .arrests {
    fill: none;
    stroke: rgb(43, 158, 222);
    stroke-width: 1.5;
  }
  .searches {
    fill: none;
    stroke: rgb(28, 220, 168);
    stroke-width: 1.5;
  }
  .stops {
    fill: none;
    stroke: rgb(110, 64, 170);
    stroke-width: 1.5;
  }
</style>
