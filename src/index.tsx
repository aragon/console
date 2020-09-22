import React from 'react'
import { render } from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import App from './App'
import GeneralProvider from './Providers/GeneralProvider'
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

render(
  <GeneralProvider>
    <React.StrictMode>
      <GlobalStyle />
      <App />
    </React.StrictMode>
  </GeneralProvider>,
  document.getElementById('root'),
)
