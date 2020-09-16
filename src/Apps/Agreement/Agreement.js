import React, { useState } from 'react'
import 'styled-components/macro'
import { useWallet } from 'use-wallet'
import {
  useAgreementSettings,
  useSignAgreement,
} from '../../lib/web3-contracts.js'

function getInfoMode(signStatus) {
  if (signStatus === 'error') {
    return 'error'
  }

  return 'info'
}

function getInfoText(signStatus) {
  if (signStatus === 'error') {
    return 'There was an error while signing the agreement.'
  }

  if (signStatus === 'already-signed') {
    return 'You have already signed this agreement.'
  }

  return 'Agreement signed successfuly.'
}

export default function Agreement({ appData: agreement }) {
  const { account } = useWallet()
  const [signState, setSignState] = useState('')
  const signAgreement = useSignAgreement(agreement.address)
  const settings = useAgreementSettings(agreement.address)

  console.log(settings)

  return (
    <>
      <div
        css={`
          margin-top: ${2 * 8}px;
        `}
      >
        <h2>Address</h2>
        <p>{agreement.address}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          const signState = await signAgreement()
          setSignState(signState)
        }}
        disabled={!account}
        css={`
          margin-top: 16px;
          font-family: 'Overpass Mono', monospace;
          font-size: 12px;
          position: relative;
          background: transparent;
          color: white;
          cursor: pointer;

          &:active {
            top: 1px;
          }
        `}
      >
        Sign Agreement
      </button>
      {signState && (
        <div
          css={`
            border: 1px solid #00f400;
            margin-top: ${3 * 8}px;
          `}
        >
          {getInfoText(signState)}
        </div>
      )}
      <div
        css={`
          margin-top: ${2 * 8}px;
        `}
      >
        <h2>Arbitrator</h2>
        <p>{settings?.arbitrator}</p>
      </div>
      <div
        css={`
          margin-top: ${2 * 8}px;
        `}
      >
        <h2>Staking pool factory</h2>
        <p>{settings?.cashier} </p>
      </div>
      <div
        css={`
          margin-top: ${2 * 8}px;
        `}
      >
        <h2>Agreement Title: {settings?.title}</h2>
      </div>
      <div
        css={`
          margin-top: ${2 * 8}px;
        `}
      >
        <h2>Agreement content</h2>
      </div>
      <a
        href={`https://ipfs.eth.aragon.network/ipfs/${settings?.content}`}
        rel="noopener noreferrer"
      >
        Content on IPFS
      </a>
    </>
  )
}
