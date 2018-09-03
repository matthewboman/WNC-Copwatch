<template>
  <div class="records">
    <div v-if="shouldDisplayOpenData">
      <app-record
        v-for="record in openDataReports"
        :record="record"
        :key="record._id"></app-record>
    </div>
    <div v-if="shouldDisplayBulletins">
      <app-record
        v-for="record in bulletionReports"
        :record="record"
        :key="record._id"></app-record>
    </div>
  </div>
</template>

<script>
  import Record from './Record.vue'

  export default {
    components: {
      appRecord: Record
    },
    computed: {
      openDataReports() {
        return this.$store.getters.displayedOpenDataReports
      },
      bulletionReports() {
        return this.$store.getters.displayedBulletinReports
      },
      shouldDisplayOpenData() {
        return this.$store.getters.displayOpenDataReports
      },
      shouldDisplayBulletins() {
        return this.$store.getters.displayBulletinReports
      }
    }
  }

  // TODO: add filters to sort displayed reports

</script>

<style lang="scss" scoped>
  .records {

  }
</style>
