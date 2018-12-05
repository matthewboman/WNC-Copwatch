<template>
  <div class="filter-group traffic-data">

    <div class="filter date-filters border-bottom">
      <h3>Date range</h3>
      <form>
        <div class="form-group">
          <label for="start">Start date:</label>
          <select id="start" class="form-control" :value="startDate" @change="changeStart">
            <option v-if="startDate" :value="startDate">{{ new Date(startDate).toDateString() }}</option>
            <option disabled value="">Choose a start date</option>
            <option v-for="date in dates" :value="date">{{ new Date(date).toDateString() }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="end">End date:</label>
          <select id="end" class="form-control" :value="endDate" @change="changeEnd">
            <option v-if="endDate" :value="endDate">{{ new Date(endDate).toDateString() }}</option>
            <option disabled value="">Choose a end date</option>
            <option v-for="date in dates" :value="date">{{ new Date(date).toDateString() }}</option>
          </select>
        </div>
      </form>
      <button type="button" class="btn btn-main" v-on:click="resetDates">Reset dates</button>
    </div>

    <div class="filter detail-filters">
      <h3>Report Details</h3>
      <form>
        <div class="form-group form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="search"
            :checked="this.details.includes('search')"
            @change="changeTrafficDetails" />
          <label for="search" class="form-check-label">Search (vehicle, driver, passenger):</label>
        </div>
        <div class="form-group form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="warrant"
            :checked="this.details.includes('warrant')"
            @change="changeTrafficDetails" />
          <label for="warant" class="form-check-label">Warrant:</label>
        </div>
        <div class="form-group form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="probable"
            :checked="this.details.includes('probable')"
            @change="changeTrafficDetails" />
          <label for="probable" class="form-check-label">Probable cause:</label>
        </div>
        <div class="form-group form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="consent"
            :checked="this.details.includes('consent')"
            @change="changeTrafficDetails" />
          <label for="consent" class="form-check-label">Consent to a search:</label>
        </div>
        <div class="form-group form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="resist"
            :checked="this.details.includes('resist')"
            @change="changeTrafficDetails" />
          <label for="resist" class="form-check-label">Physically resisted:</label>
        </div>
        <div class="form-group form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="arrest"
            :checked="this.details.includes('arrest')"
            @change="changeTrafficDetails" />
          <label for="arrest" class="form-check-label">Arrest (driver, passenger):</label>
        </div>
      </form>
    </div>

  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    computed: {
      ...mapState({
        details: state => state.traffic_reports.selectedTrafficDetails,
        dates: state => state.traffic_reports.trafficDates,
        startDate: state => state.traffic_reports.trafficStartDate,
        endDate: state => state.traffic_reports.trafficEndDate
      })
    },

    methods: {
      ...mapActions({
        updateDetails: 'updateDetails',
        updateStart: 'updateTrafficStart',
        updateEnd: 'updateTrafficEnd',
        updateTrafficDates: 'updateTrafficDates'
      }),
      changeTrafficDetails(e) {
        this.updateDetails(e.target.id)
      },
      changeStart(e) {
        this.updateStart(e.target.value)
      },
      changeEnd(e) {
        this.updateEnd(e.target.value)
      },
      resetDates() {
        this.updateTrafficDates({ start: null, end: null})
      }
    },
  }
</script>

<style lang="scss" scoped>
  .traffic-data {
    padding: 18px;
    border-radius: 6px;
    box-shadow: 2px 6px 25px rgba(0, 0, 0, 0.1);
    transition: all .3s ease;
    position: relative;

    .filter {

    }

    .date-filters {

    }

    .detail-filters {

    }
  }
</style>
