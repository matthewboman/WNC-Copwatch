<template>
  <div class="records">
    <div v-if="shouldDisplayOpenData">
      <app-open-record
        v-for="record in openDataReports"
        :record="record"
        :key="record._id"></app-open-record>
    </div>
    <div v-if="shouldDisplayBulletins">
      <app-bulletin-record
        v-for="record in bulletionReports"
        :record="record"
        :key="record._id"></app-bulletin-record>
    </div>
  </div>
</template>

<script>
  import BulletinRecord from './BulletinRecord.vue'
  import OpenRecord from './OpenRecord.vue'


  export default {
    components: {
      appBulletinRecord: BulletinRecord,
      appOpenRecord: OpenRecord
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
