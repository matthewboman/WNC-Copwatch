<template>
  <div class="records">
    <div v-if="displayTrafficReports">
      <app-ts-record
        v-for="record in displayedTrafficReports"
        :record="record"
        :key="record._id"></app-ts-record>
    </div>
    <div v-if="displayBulletinReports">
      <app-bulletin-record
        v-for="record in displayedBulletinReports"
        :record="record"
        :key="record._id"></app-bulletin-record>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import BulletinRecord from './BulletinRecord.vue'
  import TSRecord from './TSRecord.vue'

  export default {
    components: {
      appBulletinRecord: BulletinRecord,
      appTsRecord: TSRecord
    },

    computed: {
      ...mapState({
        displayTrafficReports: state => state.traffic_reports.displayTrafficReports,
        displayedTrafficReports: state => state.traffic_reports.displayedTrafficReports,

        displayBulletinReports: state => state.bulletins.displayBulletinReports,
        displayedBulletinReports: state => state.bulletins.displayedBulletinReports,
      }),
    }
  }

  // TODO: add filters to sort displayed reports

</script>

<style lang="scss" scoped>
  .records {

  }
</style>
