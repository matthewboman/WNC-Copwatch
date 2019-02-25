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
This is a resign from the ground-up beginning with a focus on user experience. The map and datavisualizations will eventually be incorporated. Version 2 will move from Vue to React-Apollo.

### Backend
* Create Express server in Typescript
* Create GraphQL endpoints for all Open Data services
* Implement Redis caching for expensive calculations
* Port daily bulletins from MongoDB to Postgres and create GraphQL endpoints
* Rewrite bullentin parser or develop more maintainable solution
