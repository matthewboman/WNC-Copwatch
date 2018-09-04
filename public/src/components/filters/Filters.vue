<template>
  <div class="filters-container">
    <h2>Filters which reports are displayed</h2>
    <div class="report-options">
      <form>
        <label class="label">APD Daily Bulletins</label>
        <input type="checkbox" id="apd" :checked="false" @change="toggleBulletinDisplay" />
        <label class="label">Open Data Reports</label>
        <input type="checkbox" id="open" :checked="false" @change="toggleODRDisplay" />
      </form>
    </div>
    <div class="display-block">
      <span>Display APD Bulletin Filters</span>
      <button class="carat" @click="displayBulletinFilters = !displayBulletinFilters">
      </button>
    </div>
    <app-bulletin-filters v-show="displayBulletinFilters"></app-bulletin-filters>
    <div class="display-block">
      <span>Display Open Data Filters</span>
      <button class="carat" @click="displayOpenDataFilters = !displayOpenDataFilters">
      </button>
    </div>
    <app-odr-filters v-show="displayOpenDataFilters"></app-odr-filters>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import BulletinFilters from './BulletinFilters'
  import ODRFilters from './ODRFilters'

  export default {
    components: {
      appBulletinFilters: BulletinFilters,
      appOdrFilters: ODRFilters,
    },
    data() {
      return {
        displayBulletinFilters: false,
        displayOpenDataFilters: false
      }
    },
    computed: {
      ...mapState({
        displayBulletinReports: state => state.displayBulletinReports,
        displayOpenDataReports: state => state.displayOpenDataReports
      })
    },
    methods: {
      ...mapActions({
        toggleODRDisplay: 'toggleODRDisplay',
        toggleBulletinDisplay: 'toggleBulletinDisplay'
      }),
    }
  }

</script>

<style lang="scss" scoped>
  .filters-container {

    .display-block {

      .carat {
        background-image: url('/public/icons/carat.png');
        background-size: 20px;
        background-position: center;
        height: 20px;
      }
    }

  }
</style>
