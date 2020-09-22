import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import 'styled-components/macro'

import DaoSelector from './components/DaoSelector.tsx'
import DaoView from './DaoView'

import TopHeader from './components/Header/Header.tsx'

function App() {
  return (
    <div
      css={`
        padding: 8px;
      `}
    >
      <TopHeader />
      <Router>
        <Switch>
          <Route exact path="/">
            <DaoSelector />
          </Route>
          <Route path="/:daoAddress">
            <DaoView />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
