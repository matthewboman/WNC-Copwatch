<template>
  <div class="filters-container">
    <h2>Filters which reports are displayed</h2>
    <div class="report-options">
      <form>
        <label class="label">APD Daily Bulletins</label>
        <input type="checkbox" id="apd" :checked="this.displayBulletinReports" @change="toggleBulletinDisplay" />
        <span class="horizontal-divider">|</span>
        <label class="label">Open Data Reports</label>
        <input type="checkbox" id="open" :checked="this.displayOpenDataReports" @change="toggleODRDisplay" />
      </form>
    </div>
    <div class="display-block">
      <button class="carat" @click="displayBulletinFilters = !displayBulletinFilters">
        Display APD Bulletin Filters
      </button>
      <transition name="open" mode="in-out">
        <app-bulletin-filters v-show="displayBulletinFilters"></app-bulletin-filters>
      </transition>
    </div>
    <div class="display-block">
      <button class="carat" @click="displayOpenDataFilters = !displayOpenDataFilters">
        Display Open Data Filters
      </button>
      <transition name="open" mode="in-out">
        <app-odr-filters v-show="displayOpenDataFilters"></app-odr-filters>
      </transition>
    </div>
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
  .horizontal-divider {
    margin: 0 12px;
  }
  .filters-container {

    .report-options {
      margin-bottom: 24px;
    }

    .display-block {
      margin-bottom: 12px;

      .display {
        margin-right: 6px;
      }

      .carat {
        padding-right: 24px;
        background-image: url('/public/icons/carat-down-white.png');
        background-size: 24px;
        background-repeat: no-repeat;
        background-position: right;
        margin-bottom: 12px;
      }
    }
  }

  /* animations */
  .open-enter {
    max-height: 0px;
    opacity: 0;
  }
  .open-enter-active {
    transition: all 0.5s ease;
  }
  .open-enter-to {
    max-height: 1000px;
    opacity: 1;
  }

  .open-leave {
    opacity: 1;
    max-height: 1000px;
  }

  .open-leave-active {
    transition: all 0.5s ease;
  }

  .open-leave-to {
    opacity: 0;
    max-height: 0px;
  }
</style>
