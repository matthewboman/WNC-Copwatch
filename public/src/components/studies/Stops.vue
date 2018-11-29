<template>
  <div class="study daily">
    <div class="legend">
      <div class="inline">
        <span>Stops per day</span>
        <span class="line-color blue"></span>
      </div>
      <div class="inline">
        <span>Arrests per day</span>
        <span class="line-color red"></span>
      </div>
      <div class="inline">
        <span>Searches per day</span>
        <span class="line-color teal"></span>
      </div>
      <button v-on:click="toggleGraphs()">toggle graphs</button>
    </div>
    <div class="graph-container">
      <svg id="all-stops" ></svg>
    </div>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  import { mapActions, mapState } from 'vuex'
  import { charts, fns } from '../../utils'

  export default {
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

    methods: {
      createSVG() {
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
         * Scale chart according to total stops
         */
        this.xScale = charts.createXScale(this.stops, this.padding, this.w)
        this.yScale = charts.createYScaleLine(this.stops, this.padding, this.h)

        /**
         * Create axes && line-drawing function
         */
        const formatTime = d3.timeFormat("%B %Y")
        const xAxis = charts.createXTimeAxis(this.xScale, 10, formatTime)
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
        console.log('rendering line graph')
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
        console.log('rendering scatter plot')
        const any = arr => arr.filter(i => i.category > 0)

        this.svg.selectAll("#stops")
          .data(stops)
          .enter()
          .append("circle")
          .attr("cx", d => this.xScale(d.date))
          .attr("cy", d => this.yScale(d.category))
          .attr("r", 2)
          .attr("fill", "blue")
          .attr('id', 'stops')
          .append('title')
          .text(d => `${d.category} stops on ${d.date}`)

        this.svg.selectAll("#arrests")
          .data(any(arrests))
          .enter()
          .append("circle")
          .attr("cx", d => this.xScale(d.date))
          .attr("cy", d => this.yScale(d.category))
          .attr("r", 2)
          .attr("fill", "red")
          .attr('id', 'arrests')
          .append('title')
          .text(d => `${d.category} arrests on ${d.date}`)

        this.svg.selectAll("#searches")
          .data(any(searches))
          .enter()
          .append("circle")
          .attr("cx", d => this.xScale(d.date))
          .attr("cy", d => this.yScale(d.category))
          .attr("r", 2)
          .attr("fill", "green")
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

  .daily {
    display: flex;
    padding: 0 5vw;
  }
  .legend {
    flex-basis: 20%;
  }
  .inline {

  }
  .line-color {
    margin-right: 12px;
    height: 20px;
    width: 20px;
    display: inline-block;
  }
  .blue {
    background-color: blue;
  }
  .red {
    background-color: red;
  }
  .teal {
    background-color: teal;
  }

  .graph-container {
    flex-basis: 80%;
  }

  /* style svgs */
  .line {
    cursor: pointer;
  }
  .arrests {
    fill: none;
    stroke: red;
    stroke-width: 1.5;
  }
  .searches {
    fill: none;
    stroke: teal;
    stroke-width: 1.5;
  }
  .stops {
    fill: none;
    stroke: blue;
    stroke-width: 1.5;
  }
</style>
