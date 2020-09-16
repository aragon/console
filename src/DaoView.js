import React, { useCallback } from 'react'
import {
  Route,
  Switch,
  useHistory,
  useRouteMatch,
  useParams,
} from 'react-router-dom'
import { Connect, useApps, useOrganization } from '@aragon/connect-react'
import 'styled-components/macro'

import AppsRouter from './Apps/Apps'

function DaoView() {
  const { path } = useRouteMatch()
  const [org, orgStatus] = useOrganization()

  const [apps, appsStatus] = useApps()

  const loading = orgStatus.loading || appsStatus.loading
  const error = orgStatus.error || appsStatus.error

  if (loading) {
    return <p>Loading…</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <Switch>
      <Route exact path={path}>
        <AppList apps={apps} />
      </Route>
      <Route path={`${path}/:appAddress`}>
        <AppsRouter apps={apps} org={org} />
      </Route>
      <Route>
        <h2>not found :(</h2>
      </Route>
    </Switch>
  )
}

function AppList({ apps }) {
  return (
    <div
      css={`
        padding: 8px;
        margin-top: ${4 * 8}px;
        border: 1px solid whitesmoke;
      `}
    >
      <h2>Apps</h2>
      <div
        css={`
          margin-top: 24px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        `}
      >
        {apps.map(app => (
          <AppCard app={app} key={app.address} />
        ))}
      </div>
    </div>
  )
}

function AppCard({ app }) {
  const history = useHistory()
  const { url } = useRouteMatch()

  const handleCardClick = useCallback(() => {
    history.push(`${url}/${app.address}`)
  }, [app, history, url])

  return (
    <button
      type="button"
      onClick={handleCardClick}
      css={`
        position: relative;
        background: transparent;
        width: 280px;
        height: 320px;
        border: 1px solid #00f400;
        padding: 16px;
        cursor: pointer;
        &:not(:last-child) {
          margin-right: 24px;
          margin-bottom: 24px;
        }
        &:active {
          top: 1px;
        }
      `}
    >
      {app.name}
    </button>
  )
}

export default function WrappedDaoView() {
  const { daoAddress } = useParams()

  return (
    <Connect
      location={daoAddress}
      connector="thegraph"
      options={{ name: 'rinkeby', network: 4 }}
    >
      <DaoView />
    </Connect>
  )
}
