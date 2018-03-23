import { adamCoords, charlieCoords, bakerCoords } from './beats'
import { wikiObjects } from './wikiObj'

const API_URL = 'http://localhost:3000/reports'
const DEFAULT_CENTER = [35.575058, -82.551487]
const DEFAULT_ZOOM = 12
const BASEMAP = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png'
const ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
const apdIcon = L.icon({ iconUrl: "/public/icons/apd.png", iconSize: [25, 25] })
const sheriffIcon = L.icon({ iconUrl: "/public/icons/sheriff.png", iconSize: [25, 25] })

const reportsByCode = (codes, reports) => reports.filter(r => codes.includes(r.code))
const reportsByOfficer = (officer, reports) => !officer ? reports :
  reports.filter(r => r.officer == officer)
const reportsByDate = (start, end, reports) => !start || !end ? reports :
  reports.filter(r => ((r.dateTime >= start) && (r.dateTime <= end)))

/*
maps officer name to their wiki--not implemented yet

const officerWiki = (officer) => wikiObjects.filter(obj => obj.displayName == officer)
  .map(obj => obj.wikiURL)[0]

<a href="${}">officer ${report.officer}</a>
*/

const reportPopup = (report) =>
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
      displayedReports: ['AR', 'TC', 'LW', 'TA'],
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
      this.displayedReports = this.displayedReports.includes(code)
        ? this.displayedReports.filter(r => r != code)
        : [...this.displayedReports, code]

      this.rerenderReports()
    },

    changeOfficer() {
      this.rerenderReports()
    },

    changeDates() {
      if (this.startDate && this.endDate) {
        this.leafleftMap.removeLayer(this.markers)
        this.markersFromReports(
          reportsByDate(this.startDate, this.endDate, this.allReports)
        )
      }
    },

    resetOfficer() {
      this.selectedOfficer = null
      this.displayedReports = ['AR', 'TC', 'LW', 'TA'] // temporary workaround. see rerenderReports()
      this.rerenderReports()
    },

    resetDates() {
      this.startDate = null
      this.endDate = null
      this.rerenderReports()
    },

    rerenderReports() {
      this.leafleftMap.removeLayer(this.markers)
      /*
      This tightly couples the code, dates, and officer filters together,
      causing weird bugs to arise with how the two functions interact.

      TODO: Make each filter function independently with own reset instead of resetting
      all together
      */
      this.markersFromReports(
        reportsByCode(
          this.displayedReports, reportsByOfficer(this.selectedOfficer, this.allReports)
        )
      )
    }
  }, // end methods

}
