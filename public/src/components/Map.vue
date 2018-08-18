<template>
  <div id="map" class="map"></div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import { adamCoords, charlieCoords, bakerCoords } from '../beats'

  const DEFAULT_CENTER = [35.575058, -82.551487]
  const DEFAULT_ZOOM = 12
  const BASEMAP = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png'
  const ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
  const apdIcon = L.icon({ iconUrl: "/public/icons/apd.png", iconSize: [25, 25] })
  const sheriffIcon = L.icon({ iconUrl: "/public/icons/sheriff.png", iconSize: [25, 25] })

  const reportPopup = report =>
    `<div>
      <p>date: ${new Date(report.dateTime).toDateString()}</p>
      <p>officer: ${report.officer}</p>
    </div>`

  export default {
    data() {
      return {
        leafleftMap: null,
        tileLayer: null,
        markers: []
      }
    },

    mounted() {
      this.initMap()
    },

    created() {
      this.$store.watch(
        state => { return this.$store.state.displayedReports },
        (current, previous) => {
          this.leafleftMap.removeLayer(this.markers)
          this.markersFromReports(current)
        }
      )
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

      markersFromReports(reports) {
        const apdMarkers = reports.filter(r => r.latLng != null)
          .filter(r => r.force == 'apd')
          .map(r => L.marker(r.latLng, { icon: apdIcon }).bindPopup(reportPopup(r)) )
        const sheriffMarkers = reports.filter(r => r.latLng != null)
          .filter(r => r.force == 'sheriff')
          .map(r => L.marker(r.latLng, { icon: sheriffIcon }).bindPopup(reportPopup(r)) )

        this.markers = L.layerGroup([...apdMarkers, ...sheriffMarkers])
        this.leafleftMap.addLayer(this.markers)
      },
    }
  }

</script>

<style lang="scss" scoped>
  .map {
    height: 70vh;
    width: 100%;
  }
</style>
