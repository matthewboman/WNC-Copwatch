<template>
  <div class="chart-container">
    <div class="title">
      <h2>Why so many searches? Unfortunately, the data isn't always there</h2>
    </div>

    <div class="row">
      <div class="col-md-4 offset-md-2 col-sm-12 legend">
        <div class="key">
          <span class="color purple">{{ searchWithProbableCause }}</span>
          <span class="value">{{ searchWithProbableCauseText }}</span>
        </div>
        <div class="key">
          <span class="color violet">{{ seachWithConsent }}</span>
          <span class="value">{{ seachWithConsentText }}</span>
        </div>
        <div class="key">
          <span class="color light-blue">{{ searchWithWarrant }}</span>
          <span class="value">{{ searchWithWarrantText }}</span>
        </div>
        <div class="key">
          <span class="color seafoam">{{ searchWithoutConsentWarrantOrProbableCause }}</span>
          <span class="value">{{ searchWithoutConsentWarrantOrProbableCauseText }}</span>
        </div>
      </div>

      <div class="col-md-6 col-sm-12">
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
      "searchWithoutConsentWarrantOrProbableCause",
      "isMobile"
    ],
    data() {
      return {
        svg: null,
        width: 400,
        height: 400,
        seachWithConsentText: "Consent was given",
        searchWithProbableCauseText: "Officer cited probable cause",
        searchWithWarrantText: "Searches were conducted with a warrant",
        searchWithoutConsentWarrantOrProbableCauseText: "Searches were conducted without warrant, consent, or probable cause"
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
          .text(`${this.searches} searches`)
      },

      dataMapper(name) {
        switch(name) {
          case 'searchWithWarrant':
            return ({
              text: this.searchWithWarrantText,
              color: 'rgb(43, 158, 222)'
            })
            break
          case 'seachWithConsent':
            return ({
              text: this.seachWithConsentText,
              color: 'rgb(91, 91, 207)'
            })
            break
          case 'searchWithProbableCause':
            return ({
              text: this.searchWithProbableCauseText,
              color: 'rgb(110, 64, 170)'
            })
            break
          case 'searchWithoutConsentWarrantOrProbableCause':
            return ({
              text: this.searchWithoutConsentWarrantOrProbableCauseText,
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
