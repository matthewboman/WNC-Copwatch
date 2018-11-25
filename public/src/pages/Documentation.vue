<template>
  <div class="container">
    <div class="block heading">
      <h1 class="documentation-heading">Documentation for the Public REST API</h1>
      <p>
        We make the REST endpoints we use to populate our map application publically available, opening the possibility for others to collect and process the data we've pulled. All endpoints are appended to the base url of <span class="base-url">http://copwatch.avlcommunityaction.com</span>, take GET requests, and return JSON.
      </p>
    </div>
    <!-- <div class="block all-reports">
      <h2 class="block-heading">Combined Reports</h2>
      <p>
        These endpoints combine reports from APD Traffic Stop Open Data and daily bulletins (more below).
      </p>
      <app-endpoint
        v-for="(endpoint, index) in shared"
        :key="index"
        v-bind:endpoint="endpoint"></app-endpoint>
    </div> -->

    <div class="block open-data">
      <h2 class="block-heading">Open Data Traffic Stops</h2>
      <p>
        These endpoints pull from and simplify <a href="http://data.ashevillenc.gov/datasets/apd-traffic-stops-after-oct-1-2017" target="_blank" rel="nofollow" referrerpolicy="no-referrer">Asheville's open data API</a>. For a better understanding of the data, you can refer to their page.
      </p>
      <app-endpoint
        v-for="(endpoint, index) in traffic_stops"
        :key="index"
        v-bind:endpoint="endpoint"></app-endpoint>
    </div>

    <div class="block bulletins">
      <h2 class="block-heading">Daily Bulletin Reports</h2>
      <p>
        These endpoints pull from our database of processed <a href="https://apdp2c.buncombecounty.org/dailybulletin.aspx" target="_blank" rel="nofollow" referrerpolicy="no-referrer" >daily bulletins</a> from APD. Older ones may also include data from Buncombe County's sheriff's office. We do not collect reports labeled "incident" or "traffic accident".
      </p>
      <app-endpoint
        v-for="(endpoint, index) in bulletins"
        :key="index"
        v-bind:endpoint="endpoint"></app-endpoint>
    </div>
  </div>
</template>

<script>
  import { Endpoint } from '../components'
  import { shared, traffic_stops, bulletins } from '../data/endpoints'

  export default {
    components: {
      appEndpoint: Endpoint
    },
    data() {
      return {
        shared: shared,
        traffic_stops,
        bulletins
      }
    }
  }

</script>

<style lang="scss" scoped>
  .container {
    padding: 0 15%;

    a {
      color: #863ddc;

      &:hover {
        color: #5f00ba;
        cursor: pointer;
      }
    }

    .base-url {
      font-weight: 600;
    }

    .documentation-heading {

    }

    .block {
      margin-bottom: 72px;
    }

    .block-heading {
      text-align: center;
    }
  }
</style>
