import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import 'typeface-roboto'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#2c6157' },
    secondary: { main: '#6fd056' }
  },
  typography: {
    useNextVariants: true
  }
})

const httpLink = new HttpLink({
  uri: process.env.SERVER_URL
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
const client = new ApolloClient({
  link,
  cache
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </MuiThemeProvider>
, document.getElementById('root'))


serviceWorker.unregister()
