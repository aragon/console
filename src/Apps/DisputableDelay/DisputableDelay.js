import React, { useEffect, useState } from 'react'
import 'styled-components/macro'
import {
  useDelayedScripts,
  useDisputableDelay,
} from './hooks/useDisputableDelay'

export default function DisputableDelay({ appData: disputableDelayApp, apps }) {
  const [disputableDelay, disputableDelayLoading] = useDisputableDelay(
    disputableDelayApp,
  )
  const [delayedScripts, delayedScriptsLoading] = useDelayedScripts(
    disputableDelay,
    apps,
  )

  const appLoading = disputableDelayLoading || delayedScriptsLoading

  return (
    <div>
      <h2>Delayed Scripts</h2>
      {!appLoading &&
        delayedScripts.map(
          ({
            actionId,
            challengeEndDate,
            challengeId,
            challenger,
            context,
            delayedScriptId,
            delayedScriptStatus,
            disputableDelayId,
            disputeId,
            evmScript,
            executedAt,
            executionFromTime,
            pausedAt,
            settledAt,
            submitter,
          }) => (
            <dl
              key={actionId}
              css={`
                border: 1px solid whitesmoke;
                padding: 8px;
              `}
            >
              <dt>Action Id</dt>
              <dd>{actionId}</dd>
              <dt>Delayed Script ID</dt>
              <dd>{delayedScriptId}</dd>
              <dt>Challenger address</dt>
              <dd>{challenger}</dd>
              <dt>Context</dt>
              <dd>{context}</dd>
              <dt>Delayed Script Status</dt>
              <dd>{delayedScriptStatus}</dd>
              <dt>evmScript</dt>
              <dd
                css={`
                  word-wrap: break-word;
                `}
              >
                {evmScript}
              </dd>
              <dt>Execution from time</dt>
              <dd>{executionFromTime}</dd>
              <dt>Submitter</dt>
              <dd>{submitter}</dd>
            </dl>
          ),
        )}
    </div>
  )
}
