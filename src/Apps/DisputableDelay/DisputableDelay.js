import React, { useEffect, useState } from 'react'
import connectDisputableDelay from '@1hive/connect-disputable-delay'
import 'styled-components/macro'

export default function DisputableDelay({ appData: disputableDelayApp }) {
  const [delay, setDelay] = useState(null)

  useEffect(() => {
    async function getDisputableDelay() {
      const disputableDelay = await connectDisputableDelay(disputableDelayApp, [
        'thegraph',
        {
          network: 4,
          subgraphUrl:
            'https://api.thegraph.com/subgraphs/name/1hive/aragon-disputable-delay-rinkeby',
        },
      ])
      console.log(disputableDelay, await disputableDelay.delayedScripts())
      setDelay(disputableDelay)
    }
    getDisputableDelay()
  }, [disputableDelayApp])
  return (
    <div>
      <h2>Disputable delay</h2>
    </div>
  )
}
