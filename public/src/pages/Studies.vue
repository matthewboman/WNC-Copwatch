<template>
  <div class="container">
    <div>
      Intro
    </div>
    <div>
      Basic stats
      <p>Since October 2017, APD has reported {{ stops }} traffic stops.</p>
      <p>Of these, {{ searches }} have let to searches and {{ arrests }} to arrests, with {{ searchWithoutArrest }} searches not leading to arrests and {{ arrestWithoutSearch }} arrests without a preceding search.</p>
      <p>Interstingly, consent was given for {{ seachWithConsent }} of the searches while {{ searchWithProbableCause }} searches were conducted because "probable cause". {{ searchWithWarrant }} searches were conducted with a warrant. Most noteably, officers performed {{ searchWithoutConsentWarrantOrProbableCause }} searches without consent, probable cause, or a warrant.</p>
      <p></p>
      <p></p>
      <p></p>
      <p></p>
    </div>
    <div>
      <app-stops></app-stops>
    </div>
    <!-- <div v-if="displaySearches">
      <h2>APD traffic stops resulting in searches</h2>
      <a href="#" v-on:click="displaySearches=false">Display arrests</a>
      <app-searches></app-searches>
    </div>
    <div v-else>
      <h2>APD traffic stops resulting in arrests</h2>
      <a href="#" v-on:click="displaySearches=true">Display searches</a>
      <app-arrests></app-arrests>
    </div> -->

    <!-- TODO: make these work together -->
    <!-- <app-searches></app-searches>
    <app-arrests></app-arrests> -->

  </div>
</template>

<script>

  import { mapActions, mapState } from 'vuex'
  import { Arrests, Daily, PerDay, Searches, Stops } from "../components/studies"
  import { fns } from '../utils'

  export default {
    components: {
      appArrests: Arrests,
      appDaily: Daily,
      appPerDay: PerDay,
      appSearches: Searches,
      appStops: Stops
    },

    data() {
      return {
        displaySearches: true,
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
        state => this.$store.state.traffic_reports.allTrafficReports,
        (current, previous) => {
          this.calculateStats(current)
        }
      )
    },

    updated() {
      // console.log(this)
    },

    mounted() {
      this.getTSReports()
    },

    methods: {
      ...mapActions({
        getTSReports: 'getTSReports'
      }),

      calculateStats(reports) {
        const formatted = fns.formatTrafficStops(reports)
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
        const details = formatted.reduce((acc, val) => {
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
            searchWithoutArrest: acc.searchWithoutArrest += searchWithoutArrest,
            arrestWithoutSearch: acc.arrestWithoutSearch += arrestWithoutSearch,
            searchWithProbableCause: acc.searchWithProbableCause += searchWithProbableCause,
            searchWithWarrant: acc.searchWithWarrant += searchWithWarrant,
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

<style lang="scss" scoped>
  .container {
    padding: 20px 15%;
  }
</style>
