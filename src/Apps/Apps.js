import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '@aragon/ui'

// Frontends
import Agreement from './Agreement/Agreement'
import DisputableDelay from './DisputableDelay/DisputableDelay'

const KNOWN_APPS = new Map([
  ['agreement', Agreement],
  ['agreement-1hive', Agreement],
  ['disputable-delay', DisputableDelay],
])

export default function Apps({ apps }) {
  const { appAddress } = useParams()
  console.log(appAddress, apps)

  const matchingApp = apps.find(({ address }) => address === appAddress)
  const matchingView = KNOWN_APPS.get(matchingApp.name)

  const MatchingView = useMemo(() => matchingView, [matchingView])
  const title = useMemo(
    () => matchingApp.name.replace(/\b\w/g, c => c.toUpperCase()),
    [matchingApp.name],
  )

  if (!matchingView) {
    return <Header primary="Generic View" />
  }

  return (
    <>
      <Header primary={title} />
      <MatchingView appData={matchingApp} />
    </>
  )
}
