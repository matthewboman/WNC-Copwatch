<template>
  <div class="filter-group traffic-data">

    <div class="filter date-filters border-bottom">
      <h3 class="section-heading">Date range</h3>
      <form class="form-group">
        <select id="start" :value="startDate" @change="changeStart">
          <option v-if="startDate" :value="startDate">{{ new Date(startDate).toDateString() }}</option>
          <option disabled value="">Choose a start date</option>
          <option v-for="date in dates" :value="date">{{ new Date(date).toDateString() }}</option>
        </select>
        <select id="end" :value="endDate" @change="changeEnd">
          <option v-if="endDate" :value="endDate">{{ new Date(endDate).toDateString() }}</option>
          <option disabled value="">Choose a end date</option>
          <option v-for="date in dates" :value="date">{{ new Date(date).toDateString() }}</option>
        </select>
      </form>
      <button type="button" class="btn-reset" v-on:click="resetDates">Reset dates</button>
    </div>

    <div class="filter detail-filters">
      <h3 class="section-heading">Report Details</h3>
      <form>
        <label class="label">Search (vehicle, driver, passenger):</label>
        <input
          type="checkbox"
          id="search"
          :checked="this.details.includes('search')"
          @change="changeTrafficDetails" />
      </form>
      <form>
        <label class="label">Warrant:</label>
        <input
          type="checkbox"
          id="warrant"
          :checked="this.details.includes('warrant')"
          @change="changeTrafficDetails" />
      </form>
      <form>
        <label class="label">Probable cause:</label>
        <input
          type="checkbox"
          id="probable"
          :checked="this.details.includes('probable')"
          @change="changeTrafficDetails" />
      </form>
      <form>
        <label class="label">Consent to a search:</label>
        <input
          type="checkbox"
          id="consent"
          :checked="this.details.includes('consent')"
          @change="changeTrafficDetails" />
      </form>
      <form>
        <label class="label">Physically resisted:</label>
        <input
          type="checkbox"
          id="resist"
          :checked="this.details.includes('resist')"
          @change="changeTrafficDetails" />
      </form>
      <form>
        <label class="label">Arrest (driver, passenger):</label>
        <input
          type="checkbox"
          id="arrest"
          :checked="this.details.includes('arrest')"
          @change="changeTrafficDetails" />
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

      .section-heading {
        margin-bottom: 6px;
      }

      .form-group {
        margin-bottom: 12px;

        select {
          margin-right: 12px;
        }
      }
    }

    .date-filters {

    }

    .detail-filters {

    }
  }
</style>
