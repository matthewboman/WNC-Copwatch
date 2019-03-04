import 'dotenv/config'
import { ApolloServer } from 'apollo-server-express'
import Promise from 'bluebird'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import redis from 'redis'

import schema from './schema'
import resolvers from './resolvers'

// Connect to the Redis client, coverting callbacks to promises for async/await
const redisAsync = Promise.promisifyAll(redis)
const client = redisAsync.createClient()

client.on('error', err => console.log(`Redis error: ${err}`))


// Create the Express app
const app = express()

app.use(cors())
app.use(bodyParser.json())


// Create the Apollo server
const apollo = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers as any,
  context: { client }
})

apollo.applyMiddleware({
  app,
  path: '/graphql'
})


// Wrap the Express server and launch the application
const httpServer = createServer(app)

apollo.installSubscriptionHandlers(httpServer)

httpServer.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`)
})
