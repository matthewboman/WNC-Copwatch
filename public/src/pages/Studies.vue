<template>
  <div>
    <div v-if="displaySearches">
      <h2>APD traffic stops resulting in searches</h2>
      <a href="#" v-on:click="displaySearches=false">Display arrests</a>
      <app-searches></app-searches>
    </div>
    <div v-else>
      <h2>APD traffic stops resulting in arrests</h2>
      <a href="#" v-on:click="displaySearches=true">Display searches</a>
      <app-arrests></app-arrests>
    </div>
  </div>
</template>

<script>
  import { Arrests, Daily, PerDay, Searches } from "../components/studies"

  export default {
    components: {
      appArrests: Arrests,
      appDaily: Daily,
      appPerDay: PerDay,
      appSearches: Searches
    },
    data() {
      return {
        displaySearches: true
      }
    }

  }

</script>

<style lang="scss" scoped>

</style>
