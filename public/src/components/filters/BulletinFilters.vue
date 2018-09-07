<template>
  <div class="filter-group bulletin">

    <div class="filter date-filters border-bottom">
      <h3 class="section-heading">Date range</h3>
      <form class="form-group">
        <select id="start" :value="startDate" @change="changeStart">
          <option v-if="startDate" :value="startDate">{{ new Date(startDate).toDateString() }}</option>
          <option disabled value="">Choose a start date</option>
          <option v-for="date in dates" :value="date">{{ new Date(date).toDateString() }}</option>
        </select>
        <select id="end ":value="endDate" @change="changeEnd">
          <option v-if="endDate" :value="endDate">{{ new Date(endDate).toDateString() }}</option>
          <option disabled value="">Choose a end date</option>
          <option v-for="date in dates" :value="date">{{ new Date(date).toDateString() }}</option>
        </select>
      </form>
      <button type="button" class="btn-reset" v-on:click="resetDates">Reset dates</button>
    </div>

    <div class="filter incident-filters border-bottom">
      <h3 class="section-heading">Type of report</h3>
      <form>
        <label class="label">Arrest:</label>
        <input type="checkbox" id="AR" :checked="true" @change="changeCode" />
      </form>
      <form>
        <label class="label">Traffic Control:</label>
        <input type="checkbox" id="TC" :checked="true" @change="changeCode" />
      </form>
      <form>
        <label class="incident-label">Incidents:</label>
        <input type="checkbox" id="LW" :checked="true" @change="changeCode" />
      </form>
    </div>

    <div class="filter officer-filters border-bottom">
      <h3 class="section-heading">Officer who filed report</h3>
      <form class="form-group">
        <select :value="selectedOfficer" @change="changeOfficer">
          <option disabled value="select an officer"></option>
          <option v-for="officer in officers" :value="officer">{{ officer }}</option>
        </select>
        <button type="button" class="btn-reset" v-on:click="resetOfficer">Reset officer</button>
      </form>
    </div>

    <div class="filter search-filter">
      <h3 class="section-heading">Search description</h3>
      <form class="form-group">
        <label class="label">Search for:</label>
        <input type="text"  @input="filterByDescription" />
      </form>
    </div>

  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { debounce, throttle } from 'lodash'

  export default {
    computed: {
      ...mapState({
        codes: selectedCodes => state.selectedCodes,
        dates: state => state.bulletinDates,
        officers: state => state.officers,
        selectedOfficer: state => state.selectedOfficer,
        startDate: state => state.bulletinStartDate,
        endDate: state => state.bulletinEndDate
      })
    },
    methods: {
      ...mapActions({
        updateCode: 'updateCode',
        updateOfficer: 'updateOfficer',
        updateDescriptions: 'updateDescriptions',
        updateDetails: 'updateDetails',
        updateBulletinDates: 'updateBulletinDates',
        updateStart: 'updateBulletinStart',
        updateEnd: 'updateBulletinEnd'
      }),
      changeCode(e) {
        this.updateCode(e.target.id)
      },
      changeOfficer(e) {
        this.updateOfficer(e.target.value)
      },
      resetOfficer() {
        this.updateOfficer(null)
      },
      filterByDescription: debounce(function(e) {
        this.updateDescriptions(e.target.value)
      }, 500),
      changeStart(e) {
        this.updateStart(e.target.value)
      },
      changeEnd(e) {
        this.updateEnd(e.target.value)
      },
      resetDates() {
        this.updateBulletinDates({ start: null, end: null})
      },
    }
  }
</script>

<style lang="scss" scoped>
  .bulletin {
    margin-bottom: 24px;
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

    .incident-filters {

    }

    .officer-filters {

    }

    .search-filter {

    }
  }
</style>
