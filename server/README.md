# About
Backend GraphQL application for copwatch.avlcommunityaction.com written in TypeScript.

## Getting started

* Install dependencies: `yarn install` | `npm install`
* Copy `.env` && set GOOGLE_API_KEY (necessary only for parsing daily bulletins)
* Copy `ormconfig.json` && set w/ your db creds

* Seed the Postgres DB with info from production app: `npm run seeder`
* Running tests: `npm test`
* Building types: `npm run generate`
* Running the app in DEV: `npm run dev`

Graphiql interface is at `localhost:{process.env.PORT}/graphql`

## Contributing
* Finish porting tests from original application
* Enable logging
* Finish route that ties traffic stop to race
* Redis caching for heavy calculations
