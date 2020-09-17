import { useState, useEffect } from 'react'
import { describeScript } from '@aragon/connect-react'
import connectDisputableDelay from '@1hive/connect-disputable-delay'
import { getExecutionTimeFromUnix } from '../../../lib/date-utils'

export function useDisputableDelay(disputableDelayApp) {
  const [disputableDelay, setDisputableDelay] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!disputableDelayApp) {
      return
    }

    let cancelled = false

    async function getDisputableDelay() {
      const disputableDelay = await connectDisputableDelay(disputableDelayApp, [
        'thegraph',
        {
          network: 4,
          subgraphUrl:
            'https://api.thegraph.com/subgraphs/name/1hive/aragon-disputable-delay-rinkeby',
        },
      ])

      if (!cancelled) {
        setDisputableDelay(disputableDelay)
        setLoading(false)
      }
    }

    getDisputableDelay()

    return () => {
      cancelled = true
    }
  }, [disputableDelayApp])

  return [disputableDelay, loading]
}

export function useDelayedScripts(disputableDelay, apps) {
  const [delayedScripts, setDelayedScripts] = useState(null)
  const [delayedScriptsLoading, setDelayedScriptsLoading] = useState(true)

  useEffect(() => {
    if (!disputableDelay) {
      return
    }

    let cancelled = false

    async function getDelayedScripts() {
      const delayedScripts = await disputableDelay.delayedScripts()

      const processedScripts = delayedScripts.map(script => {
        const executionDate = getExecutionTimeFromUnix(script.executionFromTime)

        return {
          ...script,
          executionStatus: executionDate,
        }
      })

      if (!cancelled) {
        setDelayedScripts(processedScripts)
        setDelayedScriptsLoading(false)
      }
    }

    getDelayedScripts()

    return () => {
      cancelled = true
    }
  }, [disputableDelay, apps])

  return [delayedScripts, delayedScriptsLoading]
}
