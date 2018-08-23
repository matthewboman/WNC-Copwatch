# WNC Copwatch Maps
This is a map of daily police bulletins for Asheville, NC and Buncombe County.

The Node.js backend parses police reports, saves them to a database, and provides a RestAPI endpoint.

The application renders a map of police reports and provides different filter parameters so users can see reports by officer, code, and/or date. The frontend is written in Vue.js and Leaflet.js.


## Commands
`npm run parser <filename>.xlsx`
* parses an .xlsx file and saves it to a database
* `filename` will be in force.YYYY-MM-DD.xlsx format (sheriff.2018-02-28.xlsx or apd.2018-02-28.xlsx)

`npm run dev`
* launches Vue app with hot-reload server (see `webpack.config.json`)
* runs at localhost:8080

`npm run devserver`
* launches Express server RestAPI
* requires connection to MongoDB
* endpoint: `localhost:3000/reports`

`npm run test`
* runs Jest unit tests

## Police Reports
Reports are pulled from the daily [APD](https://apdp2c.buncombecounty.org/dailybulletin.aspx) and [Buncome County Sheriff](https://bcsdp2c.buncombecounty.org/dailybulletin.aspx) police bulletins. They are then parsed to JSON and stored in a Mongo database.

### Example report:

    {
      "_id": {
        "$oid": "5a9adc8dc71e783dfb428187"
      },
      "force": "apd",
      "code": "AR",
      "description": " Arrest on chrg of Poss Of Drug Paraphernalia (M),",
      "address": "100-BLK Bleachery Blvd, Asheville, NC, ",
      "dateTime": {
        "$date": "2018-02-22T05:00:00.000Z"
      },
      "race": "",
      "officer": "Collins, J D",
      "latLng": {
        "lat": 35.579308,
        "lng": -82.51543099999999
      }
    },

## Contributing
If you'd like to contribute, clone, fork, and push your branch up for review.

### Requirements
* Node 9.* (you'll need a version that allows for array/object destructuring)
* MongoDB (or you can link to ours)
* A Google Maps API key (necessary only for parser)

We're sharing a remote MongoDB instance. You can use your own for backend development, but if you'd like access to our database, email [ccrsh@riseup.net](mailto:ccrsh@riseup.net).

API endpoints will be public and documentation provided once the site is beta.

## To Do:
* Transfer database from Mlabs to own server
* Deploy public API

### Frontend Application
* Link officers to wiki
* Move selected officer and dates to Vuex store
* Throttle/Debounce search filter
* Start application on past month (instead of trying to render all of the data)
* Theming
* User feedback when content is loading

### Backend Application
* Build spider for automatically downloading .xls
* Get dates to work with querystrings
* Update cache daily

### Configuration
* Set up environment variables
* Create Docker container


## Known Issues
* Google API bug -- some addresses return `null`
* Resetting the officer or dates updates the component, resetting the other as well. Moving the logic to the Vuex store should fix this.
