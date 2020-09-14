import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { GU } from '@aragon/ui'
import 'styled-components/macro'

import DaoSelector from './components/DaoSelector'
import DaoView from './DaoView'

import TopHeader from './components/Header/Header'

function App() {
  return (
    <>
      <TopHeader />
      <div
        css={`
          margin-top: ${12 * GU}px;
        `}
      >
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
    </>
  )
}

export default App
