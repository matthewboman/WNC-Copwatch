<template>
  <div class="chart-container">
    <div class="row">
      <h2>Why so many searches? Unfortunately, the data isn't always there</h2>
    </div>

    <div class="chart">
      <div class="legend">
        <div class="key">
          <span class="color bg-orange">{{ searchWithProbableCause }}</span>
          <span class="value">{{ searchWithProbableCauseText }}</span>
        </div>
        <div class="key">
          <span class="color bg-green">{{ seachWithConsent }}</span>
          <span class="value">{{ seachWithConsentText }}</span>
        </div>
        <div class="key">
          <span class="color bg-yellow">{{ searchWithWarrant }}</span>
          <span class="value">{{ searchWithWarrantText }}</span>
        </div>
        <div class="key">
          <span class="color bg-red">{{ searchWithoutConsentWarrantOrProbableCause }}</span>
          <span class="value">{{ searchWithoutConsentWarrantOrProbableCauseText }}</span>
        </div>
      </div>

      <div class="graph">
        <svg id="all-searches"></svg>
      </div>
    </div>

  </div>
</template>

<script>
  import * as d3 from 'd3'
  import { charts, fns } from '../../utils'

  export default {
    props: [
      "searches",
      "seachWithConsent",
      "searchWithProbableCause",
      "searchWithWarrant",
      "searchWithoutConsentWarrantOrProbableCause"
    ],
    data() {
      return {
        svg: null,
        width: 300,
        height: 300,
        seachWithConsentText: "Consent was given",
        searchWithProbableCauseText: "Officer cited probable cause",
        searchWithWarrantText: "Search was conducted with a warrant",
        searchWithoutConsentWarrantOrProbableCauseText: "Search was conducted without warrant, consent, or probable cause"
      }
    },

    mounted() {
      this.createSVG()
      this.renderGraph()
    },

    methods: {
      createSVG() {
        this.svg = d3.select("#all-searches")
          .attr('width', this.width)
          .attr('height', this.height)
      },
      renderGraph() {
        /**
         * Create dataset from props
         */
        const dataset = [
          { name: "searchWithoutConsentWarrantOrProbableCause", value: this.searchWithoutConsentWarrantOrProbableCause },
          { name: "searchWithWarrant", value: this.searchWithWarrant},
          { name: "searchWithProbableCause", value: this.searchWithProbableCause},
          { name: "seachWithConsent", value: this.seachWithConsent},
        ]

        /**
         * Initialize chart
         */
        const innerRadius = this.width / 4
        const outerRadius = this.width / 2
        const arc = charts.createArc(innerRadius, outerRadius)
        const pie = d3.pie()
          .value(d => d.value)

        /**
         * Render chart
         */
        const arcs = this.svg.selectAll("g.arc")
          .data(pie(dataset))
          .enter()
          .append("g")
          .attr("class", "arc")
          .attr("transform", `translate(${outerRadius}, ${outerRadius})`)

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
          .text(`${this.searches} searches`)
      },

      dataMapper(name) {
        switch(name) {
          case 'searchWithWarrant':
            return ({
              text: this.searchWithWarrantText,
              color: 'yellow'
            })
            break
          case 'seachWithConsent':
            return ({
              text: this.seachWithConsentText,
              color: 'green'
            })
            break
          case 'searchWithProbableCause':
            return ({
              text: this.searchWithProbableCauseText,
              color: 'orange'
            })
            break
          case 'searchWithoutConsentWarrantOrProbableCause':
            return ({
              text: this.searchWithoutConsentWarrantOrProbableCauseText,
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
