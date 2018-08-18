<template>
  <div class="records">
    <app-record
      v-for="record in records"
      :record="record"
      :key="record._id"></app-record>
  </div>
</template>

<script>
  import Record from './Record.vue'

  export default {
    components: {
      appRecord: Record
    },
    computed: {
      records() {
        return this.$store.getters.displayedReports
      }
    }
  }

  // TODO: add filters to sort displayed reports
  // TODO: tie listed reports to map reports

</script>

<style lang="scss" scoped>
  .records {

  }
</style>
