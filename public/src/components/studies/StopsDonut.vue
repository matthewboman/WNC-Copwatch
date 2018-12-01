<template>
  <div class="chart-container">
    <div class="row">
      <h2>Since October 2017, APD has reported {{ stops }} traffic stops.</h2>
    </div>

    <div class="chart">
      <div class="graph">
        <svg id="all-stops"></svg>
      </div>

      <div class="legend">
        <div class="key">
          <span class="color bg-orange">{{ uneventful }}</span>
          <span class="value">{{ uneventfulText }}</span>
        </div>
        <div class="key">
          <span class="color bg-green">{{ searchWithoutArrest }}</span>
          <span class="value">{{ searchWithoutArrestText }}</span>
        </div>
        <div class="key">
          <span class="color bg-yellow">{{ combined }}</span>
          <span class="value">{{ combinedText }}</span>
        </div>
        <div class="key">
          <span class="color bg-red">{{ arrestWithoutSearch }}</span>
          <span class="value">{{ arrestWithoutSearchText }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import * as d3 from 'd3'
  import { charts, fns } from '../../utils'

  export default {
    props: [
      "stops",
      "searches",
      "arrests",
      "arrestWithoutSearch",
      "searchWithoutArrest"
    ],
    data() {
      return {
        svg: null,
        width: 300,
        height: 300,
        uneventful: 0,
        combined: 0,
        arrestWithoutSearchText: "Arrest without search",
        searchWithoutArrestText: "Search initiated, no arrest",
        uneventfulText: "Stops without incident",
        combinedText: "Search followed by arrest"
      }
    },

    mounted() {
      this.createSVG()
      this.renderGraph()
    },

    methods: {
      createSVG() {
        this.svg = d3.select("#all-stops")
          .attr('width', this.width)
          .attr('height', this.height)
      },
      renderGraph() {
        /**
         * Create dataset from props
         */
        this.combined = this.searches - this.searchWithoutArrest
        this.uneventful = this.stops - this.searches - this.arrestWithoutSearch

        const dataset = [
          { name: "combined", value: this.combined},
          { name: "uneventful", value: this.uneventful},
          { name: "searchWithoutArrest", value: this.searchWithoutArrest},
          { name: "arrestWithoutSearch", value: this.arrestWithoutSearch},
        ]

        /**
         * Initialize chart
         */
        const innerRadius = this.width / 4
        const outerRadius = this.width / 2
        const arc = charts.createArc(innerRadius, outerRadius)
        const pie = d3.pie()
          .value(d => d.value)

        const arcs = this.svg.selectAll("g.arc")
          .data(pie(dataset))
          .enter()
          .append("g")
          .attr("class", "arc")
          .attr("transform", `translate(${outerRadius}, ${outerRadius})`)

        /**
         * Render chart
         */
        arcs.append("path")
          .attr("fill", d => this.dataMapper(d.data.name)['color'])
          .attr("d", arc)

        arcs.append("text")
          .attr("transform", d => `translate(${arc.centroid(d)})`)
          .attr("text-anchor", "middle")
          .text(d => d.value)

        arcs.append("title")
          .attr("transform", d => `translate(${arc.centroid(d)})`)
          .attr("text-anchor", "middle")
          .text(d => `${this.dataMapper(d.data.name)['text']}: ${d.value}`)

        arcs.append("text")
          .attr("text-anchor", "middle")
          .attr("y", 10)
          .text(`${this.stops} total stops`)
      },

      dataMapper(name) {
        switch(name) {
          case 'combined':
            return ({
              text: this.combinedText,
              color: 'yellow'
            })
            break
          case 'uneventful':
            return ({
              text: this.uneventfulText,
              color: 'orange'
            })
            break
          case 'searchWithoutArrest':
            return ({
              text: this.searchWithoutArrestText,
              color: 'green'
            })
            break
          case 'arrestWithoutSearch':
            return ({
              text: this.arrestWithoutSearchText,
              color: 'red'
            })
            break
        }
      },
    }
  }
</script>

<!-- we can't use scss or scope the style -->
<style>

</style>
