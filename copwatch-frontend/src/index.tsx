import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import 'typeface-roboto'

import './index.css'
import App from './App'
import apolloClient from './apollo-client'
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



ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </MuiThemeProvider>
, document.getElementById('root'))


serviceWorker.unregister()
