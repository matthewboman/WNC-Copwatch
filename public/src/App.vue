<template>
  <div class="container">
    <div id="map" class="map"></div>

    <div class="filters">
      <h2>Map Filters</h2>

      <div class="filter incident-filters">
        <span class="incident-label">Arrest:</span>
        <input type="checkbox" id="AR" :checked="true" @change="changeCode($event)" />

        <span class="incident-label">Traffic Control:</span>
        <input type="checkbox" id="TC" :checked="true" @change="changeCode($event)" />

        <span class="incident-label">Traffic Accident:</span>
        <input type="checkbox" id="TA" :checked="true" @change="changeCode($event)" />

        <span class="incident-label">Incidents:</span>
        <input type="checkbox" id="LW" :checked="true" @change="changeCode($event)" />
      </div>

      <div class="filter officer-filters">
        <span class="label">Select an officer:</span>
        <select v-model="selectedOfficer" @change="changeOfficer()">
          <option disabled value="">Select an officer</option>
          <option v-for="officer in officers">{{ officer }}</option>
        </select>
        <button class="btn-reset" v-on:click="resetOfficer">Reset officer</button>
      </div>

      <div class="filter date-filters">
        <span class="label">Select a start and end date:</span>
        <select v-model="startDate" @change="changeDates()">
          <option disabled value="">Choose a start date</option>
          <option v-for="date in dates" v-bind:value="date">{{ new Date(date).toDateString() }}</option>
        </select>
        <select v-model="endDate" @change="changeDates()">
          <option disabled value="">Choose a end date</option>
          <option v-for="date in dates" v-bind:value="date">{{ new Date(date).toDateString() }}</option>
        </select>
        <button class="btn-reset" v-on:click="resetDates">Reset dates</button>
      </div>
    </div> <!-- end map filters -->

  </div>
</template>

<script src="./app.js"></script>
<style lang="scss" scoped>@import 'main.scss'</style>
