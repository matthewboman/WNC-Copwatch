<template>
  <div class="filter-group bulletin">

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
      <button
        type="button"
        class="btn btn-main"
        v-on:click="resetDates">Reset dates</button>
      <button
        type="button"
        class="btn btn-main"
        v-if="!this.allLoaded"
        v-on:click="loadAll"
        v-on:mouseover="displayWarning = true"
        v-on:mouseleave="displayWarning = false">Load all reports</button>
      <transition name="open" mode="in-out">
        <div class="warning-container" v-if="this.displayWarning">
          <p class="warning">
            This will load thousands of reports. Application will be nonreponsive while reports are loading. Application will also filter and respond more slowly when handling many reports.
          </p>
        </div>
      </transition>
    </div>

    <div class="filter incident-filters border-bottom">
      <h3>Type of report</h3>
      <form>
        <div class="form-group form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="AR"
            :checked="this.codes.includes('AR')"
            @change="changeCode" />
          <label for="AR" class="form-check-label">Arrest</label>
        </div>
        <div class="form-group form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="TC"
            :checked="this.codes.includes('TC')"
            @change="changeCode" />
          <label for="TC" class="form-check-label">Traffic Control</label>
        </div>
        <div class="form-group form-check">
          <input
            class="form-check-input"
            type="checkbox"
            id="LW"
            :checked="this.codes.includes('LW')"
            @change="changeCode" />
          <label for="LW" class="form-check-label">Incidents</label>
        </div>
      </form>
    </div>

    <div class="filter officer-filters border-bottom">
      <h3>Officer who filed report</h3>
      <form>
        <div class="form-group">
          <label for="officer">Select an officer:</label>
          <select if="officer" class="form-control" :value="selectedOfficer" @change="changeOfficer">
            <option v-for="officer in officers" :value="officer">{{ officer }}</option>
          </select>
        </div>
        <button type="button" class="btn btn-main" v-on:click="resetOfficer">Reset officer</button>
      </form>
    </div>

    <div class="filter search-filter">
      <h3>Search description</h3>
      <form>
        <div class="form-group">
          <label for="description" class="label">Search for:</label>
          <input id="description" class="form-control" type="text" @input="filterByDescription" />
        </div>
      </form>
    </div>

  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import debounce from 'lodash/debounce'

  export default {
    data() {
      return {
        allLoaded: false,
        displayWarning: false
      }
    },

    computed: {
      ...mapState({
        codes: state => state.bulletins.selectedCodes,
        dates: state => state.bulletins.bulletinDates,
        officers: state => state.bulletins.officers,
        selectedOfficer: state => state.bulletins.selectedOfficer,
        startDate: state => state.bulletins.bulletinStartDate,
        endDate: state => state.bulletins.bulletinEndDate
      })
    },

    methods: {
      ...mapActions({
        getBulletinReports: 'getBulletinReports',
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
      loadAll() {
        this.getBulletinReports()
        this.displayWarning = false
        this.allLoaded = true
      }
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

  .warning-container {
    position: absolute;
    z-index: 10;
    background-color: pink;
    padding: 12px;
    border-radius: 6px;
    box-shadow: 2px 12px 25px rgba(0, 0, 0, 0.2);
    transition: all .3s ease;
    margin: 6px 12px 0 0;

    .warning {
      color: red;
    }
  }

  /* animations */
  .open-enter {
    max-height: 0px;
    opacity: 0;
  }
  .open-enter-active {
    transition: all 0.25s ease;
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
    transition: all 0.25s ease;
  }

  .open-leave-to {
    opacity: 0;
    max-height: 0px;
  }
</style>
