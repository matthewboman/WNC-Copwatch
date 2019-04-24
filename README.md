# WNC Copwatch
This application provides an interactive map and other visualization tools to represent police data for community members in hopes of creating greater accountability and transparency. Check out the current site at [https://copwatch.avlcommunityaction.com/](https://copwatch.avlcommunityaction.com/)

## Police Reports
Most data comes from [Asheville's open datasets](http://data.ashevillenc.gov/datasets). Some reports are pulled from the daily [APD](https://apdp2c.buncombecounty.org/dailybulletin.aspx) and [Buncome County Sheriff](https://bcsdp2c.buncombecounty.org/dailybulletin.aspx) police bulletins.

## Versioning
This branch (v2) differs greatly from the master branch. The master branch is what is currently live; this branch is being actively developed. One key difference is that the front and back end have been separated. For additionaly information, checkout the README for each.

## Requirements
* Node 9.* (you'll need a version that allows for array/object destructuring)
* Postgres
* Redis

## Development timeline

### Frontend
* Many of the components are basically working and need styled and optimized.
* Maps with markers can make the browser unresponsive
* Heatmaps work only on initial navigation due to a race condition in rendering the map and the heatlayer referencing the map. This may be a library issue.

### Backend
* Implement Redis caching for expensive calculations

### GraphQL
* Implement pagination and error handling
