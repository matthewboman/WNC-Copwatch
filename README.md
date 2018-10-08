# WNC Copwatch
This application provides an interactive map and other visualization tools to represent police data for community members in hopes of creating greater accountability and transparency. Check out the current site at [https://copwatch.avlcommunityaction.com/](https://copwatch.avlcommunityaction.com/)

The Node.js backend parses police reports, saves them to a database, and provides a RestAPI endpoint. It also processes data from [Asheville's datasets of APD traffic stops](http://data.ashevillenc.gov/datasets/apd-traffic-stops-after-oct-1-2017).

The application renders a map of police reports and provides different filter parameters so users can see reports by officer, code, and/or date. The frontend is written in Vue.js and Leaflet.js. It will also eventually incorporate D3.js for more visualizations.


## Police Reports
Reports are pulled from the daily [APD](https://apdp2c.buncombecounty.org/dailybulletin.aspx) and [Buncome County Sheriff](https://bcsdp2c.buncombecounty.org/dailybulletin.aspx) police bulletins. They are then parsed to JSON and stored in a Mongo database.

### Example bulletin report:

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

Traffic stop data is also pulled in from the [city's records](http://data.ashevillenc.gov/datasets/apd-traffic-stops-after-oct-1-2017). and simplified for our purposes.

## Contributing
If you'd like to contribute, clone, fork, and push your branch up for review.

### installation
* `git clone https://github.com/crashspringfield/WNC-Copwatch.git`
* `cd WNC-Copwatch`
* `npm install`

### Commands

`npm run parser <filename>.xlsx`
* parses an .xlsx file and saves it to a database
* `filename` will be in force.YYYY-MM-DD.xlsx format (sheriff.2018-02-28.xlsx or apd.2018-02-28.xlsx)

`npm run dev`
* launches Vue app with hot-reload server (see `webpack.config.json`)
* runs at localhost:8080

`npm run devserver`
* launches Express server RestAPI
* requires connection to MongoDB

`npm run test`
* runs Jest unit tests

### Requirements
* Node 9.* (you'll need a version that allows for array/object destructuring)
* MongoDB (or you can link to ours)
* A Google Maps API key (necessary only for parser)
* Use `.example.env` for backend development. `server.js` requires DB_URL and `parser.js` requires GOOGLE_MAP_API

We're sharing a remote MongoDB instance. You can use your own for backend development, but if you'd like access to our database, email [avlcommunityaction@gmail.com](mailto:avlcommunityaction@gmail.com).

For frontend development, you can get a list of REST endpoints and examples in [the documentation](https://copwatch.avlcommunityaction.com/documentation) of our site.

### Version 1 development (in progress or looking for help)

#### Frontend Application
* Make the rendered list of reports sortable
* Improve user feedback while map is re-rendering
* Start building new visualization tools with D3.js
* Make mobile-friendly

#### Backend Application
* Build spider for automatically downloading .xls
* Caching with Redis

#### Site Configuration
* Create Docker container

### Version 2 development
* Build and incorporate new GraphQL endpoints
* Typescript?
* Leave Vue?
* Server-side rendering?
