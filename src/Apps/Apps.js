import React from 'react'
import { useParams } from 'react-router-dom'
import { Header } from '@aragon/ui'
import Agreement from './Agreement/Agreement'

const KNOWN_APPS = new Map([['agreement', Agreement]])

export default function Apps({ apps }) {
  const { appAddress } = useParams()
  console.log(appAddress, apps)

  const matchingApp = apps.find(({ address }) => address === appAddress)
  const matchingView = KNOWN_APPS.get(matchingApp.name)

  if (!matchingView) {
    return <Header primary="Generic View" />
  }

  const MatchingView = matchingView
  const title = matchingApp.name.replace(/\b\w/g, c => c.toUpperCase())

  return (
    <>
      <Header primary={title} />
      <MatchingView appData={matchingApp} />
    </>
  )
}
