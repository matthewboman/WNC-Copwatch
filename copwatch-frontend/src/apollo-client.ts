import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = new HttpLink({
  // uri: process.env.SERVER_URL
  uri: 'http://localhost:4000/graphql'
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
})

const link = ApolloLink.from([errorLink, httpLink])
const cache = new InMemoryCache()
export default new ApolloClient({
  link,
  cache
})
