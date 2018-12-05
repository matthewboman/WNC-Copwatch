<template>
  <div class="chart-container">
    <h2 class="title">Since October 2017, APD has reported {{ stops }} traffic stops.</h2>

    <div class="row">
      <div class="col-md-4 offset-md-2 col-sm-12">
        <svg id="all-stops"></svg>
      </div>

      <div class="col-md-6 col-sm-12 legend">
        <div class="key">
          <span class="color purple">{{ uneventful }}</span>
          <span class="value">{{ uneventfulText }}</span>
        </div>
        <div class="key">
          <span class="color violet">{{ searchWithoutArrest }}</span>
          <span class="value">{{ searchWithoutArrestText }}</span>
        </div>
        <div class="key">
          <span class="color light-blue">{{ combined }}</span>
          <span class="value">{{ combinedText }}</span>
        </div>
        <div class="key">
          <span class="color seafoam">{{ arrestWithoutSearch }}</span>
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
      "searchWithoutArrest",
      "isMobile"
    ],
    data() {
      return {
        svg: null,
        width: 400,
        height: 400,
        uneventful: 0,
        combined: 0,
        arrestWithoutSearchText: "Arrests without search",
        searchWithoutArrestText: "Searches initiated, no arrest",
        uneventfulText: "Stops without incident",
        combinedText: "Searches followed by arrest"
      }
    },

    mounted() {
      this.createSVG()
      this.renderGraph()
    },

    methods: {
      createSVG() {
        if (this.isMobile) {
          this.width = fns.scaleWidth(40)
          this.height = fns.scaleWidth(40)
        }
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
          .attr("class", "white-text")
          .attr("transform", d => `translate(${arc.centroid(d)})`)
          .attr("text-anchor", "middle")
          .text(d => d.value)

        arcs.append("title")
          .attr("transform", d => `translate(${arc.centroid(d)})`)
          .attr("text-anchor", "middle")
          .text(d => `${this.dataMapper(d.data.name)['text']}: ${d.value}`)

        arcs.append("text")
          .attr("class", "text-center")
          .attr("text-anchor", "middle")
          .attr("y", 10)
          .text(`${this.stops} total stops`)
      },

      dataMapper(name) {
        switch(name) {
          case 'combined':
            return ({
              text: this.combinedText,
              color: 'rgb(43, 158, 222)'
            })
            break
          case 'uneventful':
            return ({
              text: this.uneventfulText,
              color: 'rgb(110, 64, 170)'
            })
            break
          case 'searchWithoutArrest':
            return ({
              text: this.searchWithoutArrestText,
              color: 'rgb(91, 91, 207)'
            })
            break
          case 'arrestWithoutSearch':
            return ({
              text: this.arrestWithoutSearchText,
              color: 'rgb(28, 220, 168)'
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
