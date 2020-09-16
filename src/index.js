import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { UseWalletProvider } from 'use-wallet'
import { ApolloProvider } from '@apollo/react-hooks'
import App from './App'
import env from './environment'
import 'styled-components/macro'

const GlobalStyle = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  html {
    -webkit-overflow-scrolling: touch;
  }

  body {
    height: 0;
    min-height: 100vh;
    width: 100vw;
    background: #0e0e0e;
    color: #00f400;
    font-family: 'Manrope', Helvetica, sans-serif;
  }

  body, ul, p, h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }

  button, select, input, textarea, h1, h2, h3, h4, h5, h6 {
    font-size: inherit;
    font-family: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  a, button, select, input, textarea {
    color: inherit;
  }

  strong, b {
    font-weight: 600;
  }
`

const SUBGRAPH_HTTP_URL = env('SUBGRAPH_HTTP_ENDPOINT')
const CHAIN_ID = Number(env('CHAIN_ID'))

const cache = new InMemoryCache()
const link = new HttpLink({
  uri: SUBGRAPH_HTTP_URL,
})

const client = new ApolloClient({
  cache,
  link,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <UseWalletProvider
      chainId={CHAIN_ID}
      connectors={{
        fortmatic: { apiKey: env('FORTMATIC_API_KEY') },
        portis: { dAppId: env('PORTIS_DAPP_ID') },
      }}
    >
      <React.StrictMode>
        <GlobalStyle />
        <App />
      </React.StrictMode>
    </UseWalletProvider>
  </ApolloProvider>,
  document.getElementById('root'),
)
