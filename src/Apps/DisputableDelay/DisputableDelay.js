import React, { useState } from 'react'
import 'styled-components/macro'
import {
  useChallengeAction,
  useDelayedScripts,
  useDisputeAction,
  useDisputableDelay,
  useExecuteScript,
  useSettleAction,
} from './hooks/useDisputableDelay'

export default function DisputableDelay({ appData: disputableDelayApp, apps }) {
  const [disputableDelay, disputableDelayLoading] = useDisputableDelay(
    disputableDelayApp,
  )
  const [delayedScripts, delayedScriptsLoading] = useDelayedScripts(
    disputableDelay,
    apps,
  )

  const challenge = useChallengeAction(apps)
  const dispute = useDisputeAction(apps)
  const execute = useExecuteScript(apps)
  const settle = useSettleAction(apps)

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
            executionStatus,
            pausedAt,
            settledAt,
            submitter,
          }) => (
            <div
              key={actionId}
              css={`
                border: 1px solid whitesmoke;
                padding: 8px;
              `}
            >
              <dl>
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
                <dt>Time left for execution</dt>
                <dd>{executionStatus}</dd>
                <dt>Submitter</dt>
                <dd>{submitter}</dd>
              </dl>
              <div
                css={`
                  display: flex;
                  flex-wrap: wrap;
                `}
              >
                <Button onClick={() => execute(delayedScriptId)}>
                  Execute
                </Button>
                <Button onClick={() => challenge(actionId)}>Challenge</Button>
                <Button onClick={() => dispute(actionId)}>Dispute</Button>
                <Button onClick={() => settle(actionId)}>Settle</Button>
              </div>
            </div>
          ),
        )}
    </div>
  )
}

function Button({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      css={`
        position: relative;
        margin-top: 8px;
        font-family: 'Overpass Mono', monospace;
        font-size: 16px;
        background: transparent;
        color: white;
        cursor: pointer;
        border: 1px solid whitesmoke;
        text-decoration: underline;
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        &:active {
          top: 1px;
        }
        &:not(:last-child) {
          margin-right: 8px;
        }
      `}
    >
      {children}
    </button>
  )
}
