<template>
  <div class="container">
    <div class="upper">
      <div class="map-container">
        <app-map></app-map>
      </div>
      <div class="filter-legend-container">
        <app-filters></app-filters>
        <app-legend></app-legend>
      </div>
    </div>
    <div class="lower">
      <app-records></app-records>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { Filters, Legend, Map, Records } from './components'

  export default {
    components: {
      appFilters: Filters,
      appLegend: Legend,
      appMap: Map,
      appRecords: Records
    },
    mounted() {
      this.loadReports()
    },
    methods: {
      ...mapActions({
        getReports: 'getReports'
      }),
      loadReports() {
        this.getReports()
      }
    }
  }

</script>

<style lang="scss" scoped>
  h1, h2, h3, h4, h5, h6 {
    margin-top: none;
  }

  .container {

    .upper {
      display: flex;
      flex-wrap: nowrap;

      @media (max-width: 767px) {
        flex-wrap: wrap;
      }

        .map-container {
          flex-grow: 2;
          flex-basis: 75%;
          padding: 20px;
        }

        .filter-legend-container {
          flex-grow: 1;
          padding: 20px;
        }
    }

    .lower {
      display: flex;
    }
  }
</style>
