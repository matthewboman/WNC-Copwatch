<template>
  <div class="filter-group open-data">

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
        <input type="checkbox" id="search" :checked="false" @change="changeODRDetails" />
      </form>
      <form>
        <label class="label">Warrant:</label>
        <input type="checkbox" id="warrant" :checked="false" @change="changeODRDetails" />
      </form>
      <form>
        <label class="label">Probable cause:</label>
        <input type="checkbox" id="probable" :checked="false" @change="changeODRDetails" />
      </form>
      <form>
        <label class="label">Consent to a search:</label>
        <input type="checkbox" id="consent" :checked="false" @change="changeODRDetails" />
      </form>
      <form>
        <label class="label">Physically resisted:</label>
        <input type="checkbox" id="resist" :checked="false" @change="changeODRDetails" />
      </form>
      <form>
        <label class="label">Arrest (driver, passenger):</label>
        <input type="checkbox" id="arrest" :checked="false" @change="changeODRDetails" />
      </form>
    </div>

  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    computed: {
      ...mapState({
        odrDetails: odrDetails => state.odrDetails, // ?
        dates: state => state.openDataDates,
        startDate: state => state.openStartDate,
        endDate: state => state.openEndDate
      })
    },
    methods: {
      ...mapActions({
        updateDetails: 'updateDetails',
        updateStart: 'updateODRStart',
        updateEnd: 'updateODREnd',
        updateOpenDates: 'updateOpenDates'
      }),
      changeODRDetails(e) {
        this.updateDetails(e.target.id)
      },
      changeStart(e) {
        this.updateStart(e.target.value)
      },
      changeEnd(e) {
        this.updateEnd(e.target.value)
      },
      resetDates() {
        this.updateOpenDates({ start: null, end: null})
      }
    },
  }
</script>

<style lang="scss" scoped>
  .open-data {
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
