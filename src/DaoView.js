import React, { useCallback } from 'react'
import {
  Route,
  Switch,
  useHistory,
  useRouteMatch,
  useParams,
} from 'react-router-dom'
import { Connect, useApps, useOrganization } from '@aragon/connect-react'
import { Card, GU, Header } from '@aragon/ui'
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
        <AppsRouter apps={apps} />
      </Route>
      <Route>
        <Header>not found :(</Header>
      </Route>
    </Switch>
  )
}

function AppList({ apps }) {
  return (
    <>
      <Header>Apps</Header>
      <div
        css={`
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
        `}
      >
        {apps.map(app => (
          <AppCard app={app} key={app.address} />
        ))}
      </div>
    </>
  )
}

function AppCard({ app }) {
  const history = useHistory()
  const { url } = useRouteMatch()

  const handleCardClick = useCallback(() => {
    history.push(`${url}/${app.address}`)
  }, [app, history, url])

  return (
    <Card
      onClick={handleCardClick}
      css={`
        &:not(:last-child) {
          margin-right: ${3 * GU}px;
          margin-bottom: ${3 * GU}px;
        }
      `}
    >
      {app.name}
    </Card>
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
