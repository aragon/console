import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { UseWalletProvider } from 'use-wallet'
import { ApolloProvider } from '@apollo/react-hooks'
import { Main } from '@aragon/ui'
import App from './App'
import env from './environment'

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
        <Main assets="public/aragon-ui/">
          <App />
        </Main>
      </React.StrictMode>
    </UseWalletProvider>
  </ApolloProvider>,
  document.getElementById('root'),
)
