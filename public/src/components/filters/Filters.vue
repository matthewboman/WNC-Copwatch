<template>
  <div class="filters-container">
    <h2>Filters which reports are displayed</h2>
    <div class="selectors">
      <form>
        <div class="form-group">
          <input class="form-check-input" type="checkbox" id="apd" :checked="this.displayBulletinReports" @change="toggleBulletinDisplay" />
          <label class="form-check-label" for="apd">APD Daily Bulletins</label>
        </div>
        <div class="form-group">
          <input class="form-check-input" type="checkbox" id="traffic" :checked="this.displayTrafficReports" @change="toggleTrafficDisplay" />
          <label class="form-check-label" for="traffic">Traffic Stop Reports</label>
        </div>
      </form>
    </div>

    <div class="display-block">
      <button class="btn btn-main carat" @click="displayBulletinFilters = !displayBulletinFilters">
        Display APD Bulletin Filters
      </button>
      <transition name="traffic" mode="in-out">
        <app-bulletin-filters v-show="displayBulletinFilters"></app-bulletin-filters>
      </transition>
    </div>
    <div class="display-block">
      <button class="btn btn-main carat" @click="displayTrafficStopFilters = !displayTrafficStopFilters">
        Display Traffic Stop Filters
      </button>
      <transition name="traffic" mode="in-out">
        <app-traffic-stop-filters v-show="displayTrafficStopFilters"></app-traffic-stop-filters>
      </transition>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import BulletinFilters from './BulletinFilters.vue'
  import TrafficStopFilters from './TrafficStopFilters.vue'

  export default {
    components: {
      appBulletinFilters: BulletinFilters,
      appTrafficStopFilters: TrafficStopFilters,
    },

    data() {
      return {
        displayBulletinFilters: false,
        displayTrafficStopFilters: false
      }
    },

    computed: {
      ...mapState({
        displayBulletinReports: state => state.bulletins.displayBulletinReports,
        displayTrafficReports: state => state.traffic_reports.displayTrafficReports
      })
    },

    methods: {
      ...mapActions({
        toggleTrafficDisplay: 'toggleTrafficDisplay',
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
    .selectors {
      margin-left: 1.5rem;
    }

    .display-block {
      margin-bottom: 12px;

      .display {
        margin-right: 6px;
      }

      .carat {
        padding-right: 24px;
        background-image: url('../../../icons/carat-down-white.png');
        background-size: 24px;
        background-repeat: no-repeat;
        background-position: right;
        margin-bottom: 12px;
      }
    }
  }

  /* animations */
  .traffic-enter {
    max-height: 0px;
    opacity: 0;
  }
  .traffic-enter-active {
    transition: all 0.5s ease;
  }
  .traffic-enter-to {
    max-height: 1000px;
    opacity: 1;
  }

  .traffic-leave {
    opacity: 1;
    max-height: 1000px;
  }

  .traffic-leave-active {
    transition: all 0.5s ease;
  }

  .traffic-leave-to {
    opacity: 0;
    max-height: 0px;
  }
</style>
