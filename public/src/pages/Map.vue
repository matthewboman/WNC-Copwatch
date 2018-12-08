<template>
  <div class="container-fluid">
    <section class="upper">
      <div class="row">
        <div class="col-md-8 col-sm-12">
          <app-map></app-map>
          <app-legend></app-legend>
        </div>
        <div class="col-md-4 col-sm-12">
          <app-filters></app-filters>
        </div>
      </div>
    </section>
    <section class="lower">
      <div class="row">
        <div class="col col-md-12">
          <app-records></app-records>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Legend, Map, Records } from '../components'
  import Filters from '../components/filters/Filters.vue'

  export default {
    components: {
      appFilters: Filters,
      appLegend: Legend,
      appMap: Map,
      appRecords: Records
    },

    computed: {
      bulletinReports() {
        return this.$store.state.bulletins.allBulletinReports
      },
      trafficReports() {
        return this.$store.state.traffic_reports.allTrafficReports
      }
    },

    mounted() {
      // only make requests the first time
      if (!this.trafficReports.length) {
        this.getTSReports()
      }
      if (!this.bulletinReports.length) {
        this.getInitialBulletinReports()
      }
    },

    methods: {
      ...mapActions({
        getBulletinReports: 'getBulletinReports',
        getInitialBulletinReports: 'getInitialBulletinReports',
        getTSReports: 'getTSReports'
      }),
    }
  }

</script>

<style lang="scss" scoped>
  .upper {
    margin-top: 5vh;
  }
</style>
