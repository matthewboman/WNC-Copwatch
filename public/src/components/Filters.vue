<template>
  <div class="filters-container">
    <h2>Filters which reports are displayed</h2>

    <div class="filter incident-filters">
      <h3>Type of report</h3>
      <form>
        <label class="label">Arrest:</label>
        <input type="checkbox" id="AR" :checked="true" @change="changeCode($event)" />
      </form>
      <form>
        <label class="label">Traffic Control:</label>
        <input type="checkbox" id="TC" :checked="true" @change="changeCode($event)" />
      </form>
      <form>
        <label class="incident-label">Incidents:</label>
        <input type="checkbox" id="LW" :checked="true" @change="changeCode($event)" />
      </form>
    </div>

    <div class="filter officer-filters">
      <h3>Officer who filed report</h3>
      <form>
        <label class="label">Select an officer:</label>
        <select v-model="selectedOfficer" @change="changeOfficer()">
          <option disabled value="">Select an officer</option>
          <option v-for="officer in officers">{{ officer }}</option>
        </select>
        <button class="btn-reset" v-on:click="resetOfficer">Reset officer</button>
      </form>
    </div>

    <div class="filter date-filters">
      <h3>Date range</h3>
      <form>
        <label class="label">Select a start and end date:</label>
        <select v-model="startDate" @change="changeDates()">
          <option disabled value="">Choose a start date</option>
          <option v-for="date in dates" v-bind:value="date">{{ new Date(date).toDateString() }}</option>
        </select>
        <select v-model="endDate" @change="changeDates()">
          <option disabled value="">Choose a end date</option>
          <option v-for="date in dates" v-bind:value="date">{{ new Date(date).toDateString() }}</option>
        </select>
        <button class="btn-reset" v-on:click="resetDates">Reset dates</button>
      </form>
    </div>

    <div class="filter search-filter">
      <h3>Search description</h3>
      <form>
        <label class="label">Search for:</label>
        <input type="text"  @input="filterByDescription" />
      </form>
    </div>

  </div>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'
  import { debounce, throttle } from 'lodash'

  export default {
    name: "filters",
    data() {
      return {
        selectedOfficer: null,
        startDate: null,
        endDate: null,
      }
    },
    computed: {
      ...mapState({
        codes: selectedCodes => state.selectedCodes,
        officers: state => state.officers,
        dates: state => state.dates,
      }),
    },
    methods: {
      ...mapActions({
        updateCode: 'updateCode',
        updateOfficer: 'updateOfficer',
        updateDates: 'updateDates',
        updateDescriptions: 'updateDescriptions',
      }),
      changeCode(e) {
        this.updateCode(e.target.id)
      },
      changeOfficer() {
        this.updateOfficer(this.selectedOfficer)
      },
      resetOfficer() {
        this.selectedOfficer = null
        this.updateOfficer(null)
      },
      changeDates() {
        if (this.startDate && this.endDate) {
          this.updateDates({ start: this.startDate, end: this.endDate})
        }
      },
      resetDates() {
        this.startDate = null
        this.endDate = null
        this.updateDates({ start: null, end: null })
      },
      filterByDescription: debounce(function(e) {
        this.updateDescriptions(e.target.value)
      }, 500)

    },
  }

</script>

<style lang="scss" scoped>
  .filters-container {

    .filter {

      .label {

      }
    }

    .incident-filters {

    }

    .officer-filters {

    }

    .date-filters {

    }

    .search-filter {

    }
  }
</style>
