<template>
  <div class="study daily">
    <div class="legend">
      <div class="inline">
        <span>Arrests per day</span>
        <span class="line-color red"></span>
      </div>
      <div class="inline">
        <span>Searches per day</span>
        <span class="line-color teal"></span>
      </div>
    </div>
    <div class="graph-container">
      <svg :height="h" :width="w"></svg>
    </div>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  import { mapActions, mapState } from 'vuex'

  export default {
    data() {
      return {
        svg: null,
        xScale: null,
        yScale: null,
        padding: 30,
        h: 800,
        w: 1500
      }
    },

    computed: {
      ...mapState({
        arrestsPerDay: state => state.reports.arrestsPerDay,
        searchesPerDay: state => state.searches.searchesPerDay
      })
    },

    mounted() {
      this.createSVG()
      this.getSearches()
      this.getArrests()
    },

    created() {
      this.$store.watch(
        state => this.$store.state.reports.searchesPerDay,
        (current, previous) => {
          this.renderSearches(current)
        }
      ),
      this.$store.watch(
        state => this.$store.state.reports.arrestsPerDay,
        (current, previous) => {
          this.renderArrests(current)
        }
      )
    },

    computed: {
      ...mapState({
        searchesPerDay: state => state.reports.searchesPerDay,
        arrestsPerDay: state => state.reports.arrestsPerDay
      })
    },

    updated() {
      this.renderArrests(this.arrestsPerDay)
      this.renderSearches(this.searchesPerDay)
    },

    methods: {
      ...mapActions({
        getSearches: 'getSearches',
        getArrests: 'getArrests'
      }),
      createSVG() {
        this.svg = d3.select("svg")
      },
      renderArrests(arrests) {
        const dataset = this.formatDataset(arrests, 'arrests')
        const line = d3.line()
          .x(d => this.xScale(d.date))
          .y(d => this.yScale(d.category))

        this.svg.append("path")
          .datum(dataset)
          .attr("class", 'arrests')
          .attr("d", line)
      },
      renderSearches(searches) {
        const dataset = this.formatDataset(searches, 'searches')

        this.setScale(dataset) // we want to set the scale off searches b/c it will be larger
        this.createAxises()

        const line = d3.line()
          .x(d => this.xScale(d.date))
          .y(d => this.yScale(d.category))

        this.svg.append("path")
          .datum(dataset)
          .attr("class", 'searches')
          .attr("d", line)
      },
      formatDataset(array, name) {
        return array.map(d => ({
          date: new Date(d.date),
          category: d[name]
        }))
      },
      setScale(dataset) {
        this.xScale = d3.scaleTime()
          .domain([
            d3.min(dataset, d => d.date),
            d3.max(dataset, d => d.date)
          ])
          .range([this.padding, this.w - this.padding * 2])
        this.yScale = d3.scaleLinear()
          .domain([
            d3.min(dataset, d => d.category),
            d3.max(dataset, d => d.category)
          ])
          .range([this.h - this.padding, this.padding])
      },
      createAxises() {
        const formatTime = d3.timeFormat("%B %Y")
        const xAxis = d3.axisBottom()
          .scale(this.xScale)
          .ticks(10)
          .tickFormat(this.formatTime)
        const yAxis = d3.axisLeft()
          .scale(this.yScale)
          .ticks(10)

        this.svg.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(0,${(this.h - this.padding)})`)
          .call(xAxis)

        this.svg.append("g")
          .attr("class", "axis")
          .attr("transform", `translate(${this.padding}, 0)`)
          .call(yAxis)
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
  .arrests {
    fill: none;
    stroke: red;
    stroke-width: 0.5;
  }
  .searches {
    fill: none;
    stroke: teal;
    stroke-width: 0.5;
  }
</style>
