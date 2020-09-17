import { useState, useEffect, useCallback } from 'react'
import { describeScript } from '@aragon/connect-react'
import connectDisputableDelay from '@1hive/connect-disputable-delay'
import { getExecutionTimeFromUnix } from '../../../lib/date-utils'
import { useContractWithKnownAbi } from '../../../lib/web3-contracts'

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

export function useChallengeAction(apps) {
  const agreementAddress = apps.find(app => app.name.includes('agreement'))
    .address
  const agreement = useContractWithKnownAbi('AGREEMENT', agreementAddress)

  return useCallback(
    async (actionId, settlementOffer, evidence) => {
      if (!agreement) {
        return
      }
      try {
        const canChallenge = await agreement.canChallenge(actionId)
        if (!canChallenge) {
          return 'CANNOT_CHALLENGE'
        }
        await agreement.challengeAction(
          actionId,
          settlementOffer,
          false,
          evidence,
        )
        return 'OK_CHALLENGE'
      } catch (e) {
        console.error(e)
        return 'ERROR_CHALLENGE'
      }
    },
    [agreement],
  )
}

export function useDisputeAction(apps) {
  const agreementAddress = apps.find(app => app.name.includes('agreement'))
    .address
  const agreement = useContractWithKnownAbi('AGREEMENT', agreementAddress)

  return useCallback(
    async actionId => {
      if (!agreement) {
        return
      }
      try {
        const canDispute = await agreement.canDispute(actionId)
        if (!canDispute) {
          return 'CANNOT_DISPUTE'
        }
        await agreement.disputeAction(actionId, false)
        return 'OK_DISPUTE'
      } catch (e) {
        console.error(e)
        return 'ERROR_DISPUTE'
      }
    },
    [agreement],
  )
}

export function useExecuteScript(apps) {
  const disputableDelayAddress = apps.find(app =>
    app.name.includes('disputable-delay'),
  ).address
  const disputableDelay = useContractWithKnownAbi(
    'DISPUTABLE_DELAY',
    disputableDelayAddress,
  )

  return useCallback(
    async id => {
      if (!disputableDelay) {
        return
      }
      try {
        const canExecute = await disputableDelay.canExecute(id)
        if (!canExecute) {
          return 'CANNOT_EXECUTE'
        }
        await disputableDelay.execute(id)
        return 'OK_EXECUTE'
      } catch (e) {
        console.error(e)
        return 'ERROR_DISPUTE'
      }
    },
    [disputableDelay],
  )
}

export function useSettleAction(apps) {
  const agreementAddress = apps.find(app => app.name.includes('agreement'))
    .address
  const agreement = useContractWithKnownAbi('AGREEMENT', agreementAddress)

  return useCallback(
    async actionId => {
      if (!agreement) {
        return
      }
      try {
        const canSettle = await agreement.canSettle(actionId)
        if (!canSettle) {
          return 'CANNOT_SETTLE'
        }
        await agreement.settleAction(actionId)
        return 'OK_SETTLE'
      } catch (e) {
        console.error(e)
        return 'ERROR_SETTLE'
      }
    },
    [agreement],
  )
}
