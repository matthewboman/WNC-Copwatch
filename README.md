# WNC Copwatch
This application provides an interactive map and other visualization tools to represent police data for community members in hopes of creating greater accountability and transparency. Check out the current site at [https://copwatch.avlcommunityaction.com/](https://copwatch.avlcommunityaction.com/)

The Node.js backend parses police reports, saves them to a database, and provides a RestAPI endpoint. It also processes data from [Asheville's datasets of APD traffic stops](http://data.ashevillenc.gov/datasets/apd-traffic-stops-after-oct-1-2017).

The application renders a map of police reports and provides different filter parameters so users can see reports by officer, code, and/or date. It also processes the data and displays the results in various charts and graphs. The frontend is written in Vue, Leaflet, and D3.


## Police Reports
Reports are pulled from the daily [APD](https://apdp2c.buncombecounty.org/dailybulletin.aspx) and [Buncome County Sheriff](https://bcsdp2c.buncombecounty.org/dailybulletin.aspx) police bulletins. They are then parsed to JSON and stored in a Mongo database.

Traffic stop data is also pulled in from the [city's records](http://data.ashevillenc.gov/datasets/apd-traffic-stops-after-oct-1-2017). and simplified for our purposes.

For a more detailed explanation of resources, as well as available REST endpoints, check out the project's [documentation](https://copwatch.avlcommunityaction.com/documentation).

## Contributing
If you'd like to contribute, clone, fork, and push your branch up for review.

### Installation
* `git clone https://github.com/crashspringfield/WNC-Copwatch.git`
* `cd WNC-Copwatch`
* `npm install`

### Commands

`npm run build`
* builds frontend application for production

`npm run parser <filename>.xlsx`
* parses an .xlsx file and saves it to a database
* `filename` will be in force.YYYY-MM-DD.xlsx format (sheriff.2018-02-28.xlsx or apd.2018-02-28.xlsx)

`npm run dev`
* launches Vue app with hot-reload server (see `webpack.config.json`)
* runs at localhost:8080

`npm run devserver`
* launches Express server RestAPI in development mode
* requires connection to MongoDB
* runs at localhost:3000

`npm run prod`
* launches express server RestAPI in production mode
* requires connection to MongoDB

`npm run test`
* runs Jest unit tests

### Requirements
* Node 9.* (you'll need a version that allows for array/object destructuring)
* MongoDB (or you can link to ours)
* A Google Maps API key (necessary only for daily bulletin parser)
* Use `.example.env` for backend development. `server.js` requires DB_URL and `BulletinParser.js` requires GOOGLE_MAP_API

We use a remote MongoDB instance to store daily bulletins. You can use your own for backend development, but if you'd like access to our database, email [avlcommunityaction@gmail.com](mailto:avlcommunityaction@gmail.com).

For frontend development, you can get a list of REST endpoints and examples in [the documentation](https://copwatch.avlcommunityaction.com/documentation) of our site and update [where the frontend calls the API](https://github.com/crashspringfield/WNC-Copwatch/blob/master/public/src/vuex/api.js).

### Version 1 development (in progress or looking for help)

#### Incorporating new datasets
* [911 calls](https://data-avl.opendata.arcgis.com/datasets/apd-cad-911-calls)
* [community complaints](https://data-avl.opendata.arcgis.com/datasets/apd-citizen-complaints)
* ["crime"](https://data-avl.opendata.arcgis.com/datasets/apd-public-incident-data-crime-locations)
* [beats](https://data-avl.opendata.arcgis.com/datasets/0710dd841bea4c9285fe2cbddf89409f_0)

#### Frontend Application
* Make the rendered list of reports sortable
* Improve user feedback while map is re-rendering
* Query by specific dates on map w/o having to load all

#### Backend Application
* Build spider for automatically downloading .xls
* Cache with Redis instead of directly with Node app
* Continue replacing methods that pull from Asheville's Open Data with our DB/services?

#### Site Configuration
* Code splitting to reduce size of bundle
* Write deploy script
* Create config file for pm2
* Create Docker container

### Version 2 development
* Build and incorporate new GraphQL endpoints
* Migrate DB to Postgres
* Typescript?
* Leave Vue?
* Server-side rendering?
