import { adamCoords, charlieCoords, bakerCoords } from './beats'
import { wikiObjects } from './wikiObj'

const API_URL = 'http://localhost:3000/reports'
const DEFAULT_CENTER = [35.575058, -82.551487]
const DEFAULT_ZOOM = 12
const BASEMAP = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
const apdIcon = L.icon({ iconUrl: "/public/icons/apd.png", iconSize: [25, 25] })
const sheriffIcon = L.icon({ iconUrl: "/public/icons/sheriff.png", iconSize: [25, 25] })

const filterByOfficer = (officer, reports) => !officer
  ? reports
  : reports.filter(r => r.officer == officer)
const filterByCodes = (codes, reports) => reports.filter(r => codes.includes(r.code))
const filterByDates = (start, end, reports) => (!start || !end)
  ? reports
  : reports.filter(r => ((r.dateTime >= start) && (r.dateTime <= end)))
/*
 * maps officer name to their wiki--not implemented yet
 *
 * const officerWiki = (officer) => wikiObjects.filter(obj => obj.displayName == officer)
 *   .map(obj => obj.wikiURL)[0]
 *
 * adds wiki link to returned report
 *
 * <a href="${}">officer ${report.officer}</a>
*/

const reportPopup = report =>
`<div>
  <p>date: ${new Date(report.dateTime).toDateString()}</p>
  <p>officer: ${report.officer}</p>
</div>`

export default {
  name: 'app',

  data() {
    return {
      leafleftMap: null,
      tileLayer: null,
      markers: [],
      allReports: [],
      selectedCodes: ['AR', 'TC', 'LW'],
      selectedOfficer: null,
      officers: [],
      dates: [],
      startDate: null,
      endDate: null
    }
  },

  mounted() {
    this.getReports()
    this.initMap()
  },

  computed: {

  },

  methods: {
    getReports() {
      this.$http.get(API_URL)
        .then(res => {
          this.allReports = res.body

          this.officers = this.allReports.map(r => r.officer)
            .filter((item, pos, arr) => arr.indexOf(item) == pos).sort()
          this.dates = this.allReports.map(r => r.dateTime)
            .filter((item, pos, arr) => arr.indexOf(item) == pos).sort()

          this.markersFromReports(this.allReports)
        })
        .catch(err => console.log(err))
    },

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

    changeCode(e) {
      const code = e.target.id
      this.selectedCodes = this.selectedCodes.includes(code)
        ? this.selectedCodes.filter(r => r != code)
        : [...this.selectedCodes, code]

      this.rerenderReports()
    },

    changeOfficer() {
      this.rerenderReports()
    },

    changeDates() {
      if (this.startDate && this.endDate) {
        this.rerenderReports()
      }
    },

    resetOfficer() {
      this.selectedOfficer = null
      this.rerenderReports()
    },

    resetDates() {
      this.startDate = null
      this.endDate = null
      this.rerenderReports()
    },

    rerenderReports() {
      this.leafleftMap.removeLayer(this.markers)

      const officerReports = reports => filterByOfficer(this.selectedOfficer, reports)
      const codeReports = reports => filterByCodes(this.selectedCodes, reports)
      const dateReports = reports => filterByDates(this.startDate, this.endDate, reports)

      const filterBySelections = this.$R.compose(
        officerReports,
        codeReports,
        dateReports
      )
      this.markersFromReports(filterBySelections(this.allReports))
    }
  }, // end methods

}
