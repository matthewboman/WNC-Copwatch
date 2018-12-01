<template>
  <div class="studies-container">
    <div>
      <p>Intro</p>
    </div>

    <div v-if="stops != 0">
      <app-stops-donut
        :stops="stops"
        :searches="searches"
        :arrests="arrests"
        :searchWithoutArrest="searchWithoutArrest"
        :arrestWithoutSearch="arrestWithoutSearch"
      ></app-stops-donut>
    </div>

    <div v-if="searches != 0">
      <app-searches-donut
        :searches="searches"
        :seachWithConsent="seachWithConsent"
        :searchWithWarrant="searchWithWarrant"
        :searchWithProbableCause="searchWithProbableCause"
        :searchWithoutConsentWarrantOrProbableCause="searchWithoutConsentWarrantOrProbableCause"
      ></app-searches-donut>
    </div>

    <app-stops></app-stops>
    <app-searches></app-searches>
    <app-arrests></app-arrests>

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
        searchWithoutConsentWarrantOrProbableCause: 0
      }
    },

    created() {
      this.$store.watch(
        state => this.$store.state.traffic_reports.formattedTrafficReports,
        (current, previous) => {
          this.calculateStats(current)
        }
      )

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
  .studies-container {
    padding: 20px 15%;
  }

  /**
   * style SVGs -- not scoped, so this will cary down to child (and other) components
   */
  text {
    stroke: #666;
  }

  .bg-red {
    background-color: red;
  }

  .bg-orange {
    background-color: orange;
  }

  .bg-yellow {
    background-color: yellow;
  }

  .bg-green {
    background-color: green;
  }

  /* Donut Graphs */
  .chart-container {

  }

  .chart-container .row {

  }

  .chart-container .chart {
    display: flex;
  }
  .chart-container .chart .graph {
    flex-basis: 50%;
  }
  .chart-container .chart .legend {
    flex-basis: 50%;
  }
  .chart-container .chart .legend .key{

  }
  .chart-container .chart .legend .key .color{
    height: 40px;
    width: 40px;
    display: inline-block;
  }
  .chart-container .chart .legend .key .value{

  }

  /* Line Graphs */



  /* Area Graphs */

  .area {
    stroke: none;
    cursor: pointer;
  }

  .area:hover {
    fill: yellow;
  }
</style>
