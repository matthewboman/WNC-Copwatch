<template>
  <div class="filters-container">
    <h2>Filters which reports are displayed</h2>
    <app-bulletin-filters></app-bulletin-filters>
    <app-odr-filters></app-odr-filters>
  </div>
</template>

<script>
  import BulletinFilters from './BulletinFilters'
  import ODRFilters from './ODRFilters'

  export default {
    components: {
      appBulletinFilters: BulletinFilters,
      appOdrFilters: ODRFilters,
    }
  }

</script>

<style lang="scss" scoped>
  .filters-container {

  }
</style>
