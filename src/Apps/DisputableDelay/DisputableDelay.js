import React, { useCallback, useState } from 'react'
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
                  flex-direction: column;
                `}
              >
                <h2>Actions</h2>
                <div
                  css={`
                    max-width: 800px;
                  `}
                >
                  <ChallengeSection actionId={actionId} onClick={challenge} />
                  <DisputeSection actionId={actionId} onClick={dispute} />
                  <SettleSection actionId={actionId} onClick={settle} />
                  <ExecuteSection
                    delayedScriptId={delayedScriptId}
                    onClick={execute}
                  />
                </div>
              </div>
            </div>
          ),
        )}
    </div>
  )
}

function ExecuteSection({ delayedScriptId, onClick }) {
  const handleExecute = useCallback(async () => {
    await onClick(delayedScriptId)
  }, [delayedScriptId, onClick])

  return (
    <div
      css={`
        border: 1px solid whitesmoke;
        padding: 8px;
        display: flex;
        flex-direction: column;
      `}
    >
      <h3> Execute </h3>
      <Button onClick={handleExecute}>Execute</Button>
    </div>
  )
}

function ChallengeSection({ actionId, onClick }) {
  const [offer, setOffer] = useState('')
  const [evidence, setEvidence] = useState('')

  const handleChallenge = useCallback(async () => {
    await onClick(actionId, offer, evidence)
  }, [actionId, evidence, offer, onClick])

  return (
    <div
      css={`
        border: 1px solid whitesmoke;
        padding: 8px;
        display: flex;
        flex-direction: column;
      `}
    >
      <h3> Challenge </h3>
      <label>
        Settlement offer (in Wei)
        <input
          type="input"
          placeholder="1000000000000000000..."
          value={offer}
          onChange={e => setOffer(e.target.value)}
          css={`
            color: black;
          `}
        />
      </label>
      <label>
        Evidence (plain text or IPFS CID)
        <input
          type="input"
          placeholder="IPFS CID"
          value={evidence}
          onChange={e => setEvidence(e.target.value)}
          css={`
            color: black;
          `}
        />
      </label>
      <Button onClick={handleChallenge}>Challenge</Button>
    </div>
  )
}

function DisputeSection({ actionId, onClick }) {
  const handleDispute = useCallback(async () => {
    await onClick(actionId)
  }, [actionId])

  return (
    <div
      css={`
        border: 1px solid whitesmoke;
        padding: 8px;
        display: flex;
        flex-direction: column;
      `}
    >
      <h3> Dispute </h3>
      <Button onClick={handleDispute}>Challenge</Button>
    </div>
  )
}

function SettleSection({ actionId, onClick }) {
  const handleSettle = useCallback(async () => {
    await onClick(actionId)
  }, [actionId])

  return (
    <div
      css={`
        border: 1px solid whitesmoke;
        padding: 8px;
        display: flex;
        flex-direction: column;
      `}
    >
      <h3> Settle </h3>
      <Button onClick={handleSettle}>Challenge</Button>
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
