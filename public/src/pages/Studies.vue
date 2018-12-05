<template>
  <div class="container-fluid studies">

    <div v-if="stops != 0">
      <app-stops-donut
        :stops="stops"
        :searches="searches"
        :arrests="arrests"
        :searchWithoutArrest="searchWithoutArrest"
        :arrestWithoutSearch="arrestWithoutSearch"
        :isMobile="isMobile"
      ></app-stops-donut>
    </div>

    <div v-if="searches != 0">
      <app-searches-donut
        :searches="searches"
        :seachWithConsent="seachWithConsent"
        :searchWithWarrant="searchWithWarrant"
        :searchWithProbableCause="searchWithProbableCause"
        :searchWithoutConsentWarrantOrProbableCause="searchWithoutConsentWarrantOrProbableCause"
        :isMobile="isMobile"
      ></app-searches-donut>
    </div>

    <app-stops :isMobile="isMobile"></app-stops>
    <app-searches :isMobile="isMobile"></app-searches>
    <app-arrests :isMobile="isMobile"></app-arrests>

  </div>
</template>

<script>

  import { mapActions, mapState } from 'vuex'
  import { Arrests, Searches, SearchesDonut, Stops, StopsDonut } from "../components/studies"
  import { fns } from '../utils'

  export default {
    components: {
      appArrests: Arrests,
      appSearches: Searches,
      appSearchesDonut: SearchesDonut,
      appStops: Stops,
      appStopsDonut: StopsDonut
    },

    data() {
      return {
        reports: [],
        stops: 0,
        searches: 0,
        arrests: 0,
        searchWithoutArrest: 0,
        arrestWithoutSearch: 0,
        seachWithConsent: 0,
        searchWithProbableCause: 0,
        searchWithWarrant: 0,
        searchWithoutConsentWarrantOrProbableCause: 0,
        isMobile: false
      }
    },

    created() {
      this.$store.watch(
        state => this.$store.state.traffic_reports.formattedTrafficReports,
        (current, previous) => {
          this.calculateStats(current)
        }
      )
      this.isMobile = fns.isMobile
    },

    mounted() {
      this.getTSReports()
    },


    methods: {
      ...mapActions({
        getTSReports: 'getTSReports'
      }),

      calculateStats(reports) {
        // This is a resource-heavy function, so use an object as the accumulator to run only once
        const accumulator = {
          stops: 0,
          searches: 0,
          arrests: 0,
          searchWithoutArrest: 0,
          arrestWithoutSearch: 0,
          seachWithConsent: 0,
          searchWithProbableCause: 0,
          searchWithWarrant: 0,
          searchWithoutConsentWarrantOrProbableCause: 0
        }
        // TODO: extract into testable functions
        const details = reports.reduce((acc, val) => {
          const searchWithoutArrest = (
            (val.searches >= 1 && val.arrests === 0) ||
            (val.searches > val.arrests)
          ) ? (val.searches - val.arrests) : 0
          const arrestWithoutSearch = (
            (val.searches === 0 && val.arrests >= 1) ||
            (val.searches < val.arrests)
          ) ? (val.arrests - val.searches) : 0
          const seachWithConsent = (
            val.t_search_consent >= 1
          ) ? val.t_search_consent : 0
          const searchWithProbableCause = (
            val.t_probable_cause >= 1
          ) ? val.t_probable_cause : 0
          const searchWithWarrant = (
            val.t_search_warrant >= 1
          ) ? val.t_search_warrant : 0
          const searchWithoutConsentWarrantOrProbableCause = (
            (val.searches >= 1 && val.t_search_consent === 0 && val.t_probable_cause === 0 && val.t_probable_cause === 0) ||
            (val.searches > (val.t_search_consent + val.t_probable_cause + val.t_probable_cause))
          ) ? (val.searches - val.t_search_consent - val.t_probable_cause - val.t_probable_cause) : 0
          return {
            stops: acc.stops += val.stops,
            searches: acc.searches += val.searches,
            arrests: acc.arrests += val.arrests,

            seachWithConsent: acc.seachWithConsent += seachWithConsent,
            searchWithProbableCause: acc.searchWithProbableCause += searchWithProbableCause,
            searchWithWarrant: acc.searchWithWarrant += searchWithWarrant,

            searchWithoutArrest: acc.searchWithoutArrest += searchWithoutArrest,
            arrestWithoutSearch: acc.arrestWithoutSearch += arrestWithoutSearch,
            searchWithoutConsentWarrantOrProbableCause: acc.searchWithoutConsentWarrantOrProbableCause += searchWithoutConsentWarrantOrProbableCause
          }
        }, accumulator)

        for (const [key, value] of Object.entries(details)) {
          this[key] = value
        }
      },

    }
  }

</script>

<style>
  .studies {
    margin-top: 5vh;
  }

  /**
   * style SVGs -- not scoped, so this will cary down to child (and other) components
   */
  text {
    /* stroke: #666; */
    stroke: none;
    fill: #666;
  }

  .white-text {
    stroke: #fff;
    fill: #fff;
  }

  .text-center {
    font-size: 1.5rem;
  }

  /* colors based on  d3.interpolateCool */
  .purple {
    color: rgb(110, 64, 170);
  }
  .bg-purple {
    background-color: rgb(110, 64, 170);
  }
  .violet {
    color: rgb(91, 91, 207);
  }
  .bg-violet {
    background-color: rgb(91, 91, 207);
  }
  .light-blue {
    color: rgb(43, 158, 222);
  }
  .bg-light-blue {
    background-color: rgb(43, 158, 222);
  }
  .seafoam {
    color: rgb(28, 220, 168);
  }
  .bg-seafoam {
    background-color: rgb(28, 220, 168);
  }
  .light-green {
    color: rgb(52, 240, 126);
  }
  .bg-light-green {
    background-color: rgb(52, 240, 126);
  }
  .bg-green-yellow {
    background-color: rgb(147, 244, 87);
  }
  .bg-yellow-green {
    background-color: rgb(208, 234, 104);
  }

  /* Donut Graphs */
  .chart-container {
    margin-bottom: 20vh;
  }

  .chart-container .title {
    text-align: center;
    margin-bottom: 3rem;
  }

  .chart-container svg {

  }

  .chart-container .legend {

  }
  .chart-container .legend .key span{
    line-height: 2.5rem;
  }
  .chart-container .legend .key .color{
    font-size: 2rem;
    font-weight: bold;
  }
  .chart-container .chart .legend .key .value{
    font-size: 1.5rem;
  }

  /* Line Graphs */
  .chart-container .legend .key .bg-color{
    height: 20px;
    width: 20px;
    display: inline-block;
    border-radius: 20px;
  }


  /* Area Graphs */

  .area {
    stroke: none;
    cursor: pointer;
  }

  .area:hover {
    fill: yellow;
  }
</style>
