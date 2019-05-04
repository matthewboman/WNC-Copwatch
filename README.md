# WNC Copwatch
This application provides an interactive map and other visualization tools to represent police data for community members in hopes of creating greater accountability and transparency. Check out the current site at [https://copwatch.avlcommunityaction.com/](https://copwatch.avlcommunityaction.com/)

## Police Reports
Most data comes from [Asheville's open datasets](http://data.ashevillenc.gov/datasets). Some reports are pulled from the daily [APD](https://apdp2c.buncombecounty.org/dailybulletin.aspx) and [Buncome County Sheriff](https://bcsdp2c.buncombecounty.org/dailybulletin.aspx) police bulletins.

## Versioning
Version 2 differs great;y what is currently live; this branch is being actively developed. One key difference is that the front and back end have been separated. For additionaly information, checkout the README for each.

## Requirements
* Node 9.* (you'll need a version that allows for array/object destructuring)
* Postgres (version 2 only)
* Redis (version 2 only)
* MongoDB (version 1 only)
* A Google Maps API key (necessary only for daily bulletin parser)
* Use `.example.env` for backend development. `server.js` requires DB_URL and `BulletinParser.js` requires GOOGLE_MAP_API

We use a remote MongoDB instance to store daily bulletins. You can use your own for backend development, but if you'd like access to our database, email [avlcommunityaction@gmail.com](mailto:avlcommunityaction@gmail.com).

For frontend development, you can get a list of REST endpoints and examples in [the documentation](https://copwatch.avlcommunityaction.com/documentation) of our site and update [where the frontend calls the API](https://github.com/crashspringfield/WNC-Copwatch/blob/master/public/src/vuex/api.js).

### Version 1 development

**I'm not currently adding new features to this branch, but feel free to if you'd like. It exists for bug fixes and security patches. If you would like to help out, check out the `v2` branch for active development.**
Any development for the production site should be done on the V1 branch.

Directories that begin with an underscore are V1 for reference only.

#### Frontend Application
* Make the rendered list of reports sortable
* Improve user feedback while map is re-rendering
* Query by specific dates on map w/o having to load all


### Version 2 development
We're still pulling from the city's API. This can cause issues with speed.
One option would be to cache results with Redis.
Another option would be to write DB seeders && store all in our DB.

### Frontend
* Many of the components are basically working and need styled and optimized.
* Maps with markers can make the browser unresponsive
* Heatmaps work only on initial navigation due to a race condition in rendering the map and the heatlayer referencing the map. This may be a library issue.

### Backend
* Implement Redis caching for expensive calculations

### GraphQL
* Implement pagination and error handling

#### Site Configuration
* Code splitting to reduce size of bundle
* Write deploy script
* Create config file for pm2
* Create Docker container
