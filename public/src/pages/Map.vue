<template>
  <div class="container">
    <div class="upper">
      <div class="map-container">
        <app-map></app-map>
        <app-legend></app-legend>
      </div>
      <div class="filter-legend-container">
        <app-filters></app-filters>
      </div>
    </div>
    <div class="lower">
      <div class="report-container">
        <app-records></app-records>
      </div>
      <div class="temp"></div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Legend, Map, Records } from '../components'
  import Filters from '../components/filters/Filters'

  export default {
    components: {
      appFilters: Filters,
      appLegend: Legend,
      appMap: Map,
      appRecords: Records
    },
    mounted() {
      this.getOpenDataReports()
      // this.getBulletinReports()
      this.getInitialBulletinReports()
    },
    methods: {
      ...mapActions({
        getBulletinReports: 'getBulletinReports',
        getInitialBulletinReports: 'getInitialBulletinReports',
        getOpenDataReports: 'getOpenDataReports'
      }),
    }
  }

</script>

<style lang="scss" scoped>
  .container {

    .upper {
      display: flex;
      flex-wrap: nowrap;
      padding: 0 20px;

      @media (max-width: 767px) {
        flex-wrap: wrap;
      }

        .map-container {
          flex-grow: 2;
          flex-basis: 75%;
          padding: 18px;
          box-shadow: 2px 6px 25px rgba(0, 0, 0, 0.1);
          transition: all .3s ease;
          position: relative;
          border-radius: 6px;
        }

        .filter-legend-container {
          flex-grow: 1;
          flex-basis: 25%;
          padding: 18px;
        }
    }

    .lower {
      display: flex;
      flex-wrap: nowrap;

      .report-container {
        flex-grow: 2;
        flex-basis: 75%;
        padding: 20px;
      }

      .temp {
        flex-grow: 1;
        flex-basis: 25%;
        padding: 20px;
      }
    }
  }
</style>
