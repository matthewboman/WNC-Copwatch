# WNC Copwatch Maps
This is a map of daily police bulletins for Asheville, NC and Buncombe County.

Node.js parses police reports, saves them to a database, and provides a RestAPI endpoint.

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
* A Google Maps API key (only necessary for parser)

We're sharing a remote MongoDB instance. You can use your own, but if you'd like
access to our database, email [ccrsh@riseup.net](mailto:ccrsh@riseup.net).

## To Do:
* connect application to [open traffic stop data](http://data.ashevillenc.gov/datasets/apd-traffic-stops-after-oct-1-2017)


### Frontend Application
* link to wiki

### Backend Application
* build spider for automatically downloading .xls
* move routes to index, create controllers, handle api calls to various services

### Configuration
* set up environment variables
* run everything as single command
* create Docker container


## Known Issues
* Google API bug -- some addresses return `null`
