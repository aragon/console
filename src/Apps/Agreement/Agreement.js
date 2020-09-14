import React, { useState } from 'react'
import 'styled-components/macro'
import { useWallet } from 'use-wallet'
import {
  Box,
  Button,
  GU,
  IdentityBadge,
  Info,
  Link,
  textStyle,
} from '@aragon/ui'
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
    <Box>
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <h2
          css={`
            ${textStyle('title2')}
          `}
        >
          Address
        </h2>
        <IdentityBadge entity={agreement.address} />
      </div>
      <Button
        label="Sign"
        mode="strong"
        onClick={async () => {
          const signState = await signAgreement()
          setSignState(signState)
        }}
        disabled={!account}
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        Sign Agreement
      </Button>
      {signState && (
        <Info
          mode={getInfoMode(signState)}
          css={`
            margin-top: ${3 * GU}px;
          `}
        >
          {getInfoText(signState)}
        </Info>
      )}
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <h2
          css={`
            ${textStyle('title2')}
          `}
        >
          Arbitrator
        </h2>
        <IdentityBadge entity={settings?.arbitrator} />
      </div>
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <h2
          css={`
            ${textStyle('title2')}
          `}
        >
          Staking pool factory
        </h2>
        <IdentityBadge entity={settings?.cashier} />
      </div>
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <h2
          css={`
            ${textStyle('title2')}
          `}
        >
          Agreement Title: {settings?.title}
        </h2>
      </div>
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <h2
          css={`
            ${textStyle('title2')}
          `}
        >
          Agreement content
        </h2>
      </div>
      <Link
        href={`https://ipfs.eth.aragon.network/ipfs/${settings?.content}`}
        external
      >
        Content on IPFS
      </Link>
    </Box>
  )
}
