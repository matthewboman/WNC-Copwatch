<template>
  <div class="wrapper">
    <div id="map" class="map"></div>
    <img v-if="loading" class="loading" src="../../icons/loading.svg" />
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import { adamCoords, charlieCoords, bakerCoords } from '../data/beats'
  import L from 'leaflet'

  const DEFAULT_CENTER = [35.575058, -82.551487]
  const DEFAULT_ZOOM = 12
  const BASEMAP = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png'
  const ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
  const apdIcon = L.icon({ iconUrl: "../../icons/apd.png", iconSize: [15, 15] })
  const sheriffIcon = L.icon({ iconUrl: "/icons/sheriff.png", iconSize: [15, 15] })
  const openIcon = L.icon({ iconUrl: "../../icons/open-icon.png", iconSize: [10, 10] })

  // TODO: get icons working in DEV
  const renderIcon = url => L.icon({ iconUrl: url, iconSize: [10, 10] })

  const bulletinPopup = report =>
    `<div>
      <p>date: ${new Date(report.dateTime).toDateString()}</p>
      <p>officer: ${report.officer}</p>
    </div>`

  const trafficStopPopup = report =>
    `<div>
      <p>date: ${new Date(report.dateTime).toDateString()}</p>
    </div>`

  export default {
    data() {
      return {
        leafleftMap: null,
        tileLayer: null,
        bulletinMarkers: [],
        trafficStopMarkers: []
      }
    },

    computed: {
      ...mapState({
        displayBulletinReports: state => state.bulletins.displayBulletinReports,
        displayedBulletinReports: state => state.bulletins.displayedBulletinReports,
        displayTrafficReports: state => state.traffic_reports.displayTrafficReports,
        displayedTrafficReports: state => state.traffic_reports.displayedTrafficReports,
        loading: state => state.loading
      })
    },

    created() {
      this.$store.watch(
        state => this.$store.state.bulletins.displayedBulletinReports,
        (current, previous) => {
          this.leafleftMap.removeLayer(this.bulletinMarkers)
          this.markersFromReports(current, 'bulletin')
        }
      )
      this.$store.watch(
        state => this.$store.state.traffic_reports.displayedTrafficReports,
        (current, previous) => {
          this.leafleftMap.removeLayer(this.trafficStopMarkers)
          this.markersFromReports(current, 'traffic')
        }
      )
    },

    mounted() {
      this.initMap()
      if (this.displayedBulletinReports.length) {
        this.leafleftMap.removeLayer(this.bulletinMarkers)
        this.markersFromReports(this.displayedBulletinReports, 'bulletin')
      }
      if (this.displayedTrafficReports.length) {
        this.leafleftMap.removeLayer(this.trafficStopMarkers)
        this.markersFromReports(this.displayedTrafficReports, 'traffic')
      }
    },

    methods: {
      initMap() {
        this.leafleftMap = L.map('map').setView(DEFAULT_CENTER, DEFAULT_ZOOM)
        this.tileLayer = L.tileLayer(BASEMAP,  { attribution: ATTRIBUTION })
        this.tileLayer.addTo(this.leafleftMap)

        L.polygon(adamCoords, {color: 'green'}).addTo(this.leafleftMap)
        L.polygon(charlieCoords, {color: 'yellow'}).addTo(this.leafleftMap)
        L.polygon(bakerCoords, {color: 'red'}).addTo(this.leafleftMap)
      },
      markersFromReports(reports, type) {
        switch(type) {
          case 'bulletin':
            const apdMarkers = reports.filter(r => r.latLng != null)
              .filter(r => r.force == 'apd')
              .map(r => L.marker(r.latLng, { icon: apdIcon }).bindPopup(bulletinPopup(r)) )
            const sheriffMarkers = reports.filter(r => r.latLng != null)
              .filter(r => r.force == 'sheriff')
              .map(r => L.marker(r.latLng, { icon: sheriffIcon }).bindPopup(bulletinPopup(r)) )

            this.bulletinMarkers = L.layerGroup([...apdMarkers, ...sheriffMarkers])
            this.leafleftMap.addLayer(this.bulletinMarkers)
            break

          case 'traffic':
            const trafficStopMarkers = reports.filter(r => r.latLng != null)
              .map(r => L.marker(r.latLng, { icon: openIcon }).bindPopup(trafficStopPopup(r)) )

            this.trafficStopMarkers = L.layerGroup([ ...trafficStopMarkers ])
            this.leafleftMap.addLayer(this.trafficStopMarkers)
            break
          default:
            return
        }
      },
    }
  }

</script>

<style lang="scss" scoped>
  .wrapper {
    position: relative;
    margin-bottom: 18px;
    align-content: center;

    .map {
      height: 80vh;
      width: 100%;
      z-index: 0;
    }

    .loading {
      z-index: 10;
      height: 150px;
      width: 150px;
      left: 50%;
      top: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      -webkit-transform: translate(-50%, -50%);
      -animation: spin 3s infinite linear;
      -ms-animation: spin 3s infinite linear;
      -webkit-animation: spinw 3s infinite linear;
      -moz-animation: spinm 3s infinite linear;
    }
  }

  @keyframes spin {
    from { transform: scale(1) rotate(0deg);}
    to { transform: scale(1) rotate(360deg);}
  }

  @-webkit-keyframes spinw {
    from { -webkit-transform: rotate(0deg);}
    to { -webkit-transform: rotate(360deg);}
  }

  @-moz-keyframes spinm {
    from { -moz-transform: rotate(0deg);}
    to { -moz-transform: rotate(360deg);}
  }

</style>
